'use client';

import React from 'react';
import { Modal, Button, Flex, Card } from '@/shared/ui';
import { Form, InputNumber, Input, Select } from 'antd';
import { Icon } from '@/shared/ui/icon';
import type { MealDemoDetailMenu } from '@/types/mealdemo';
import type { UpdateMealDemoDetailPayload, UpdateMealDemoSessionPayload, UpdateMealDemoIngredientPayload } from '@/types/mealdemo';
import { useUpdateMealDemoDetail } from '@/tanstack/hooks/mealdemo';
import { useSearchMealIngredients } from '@/tanstack/hooks/mealingredient';
import toast from 'react-hot-toast';

/**
 * Props của component MealPlanDetailUpdateModal
 */
interface MealPlanDetailUpdateModalProps {
  isOpen: boolean; // Trạng thái mở/đóng modal
  onClose: () => void; // Callback khi đóng modal
  mealDemoId: string | null; // ID của meal plan
  menus: MealDemoDetailMenu[]; // Danh sách menus cần cập nhật
  isLoading?: boolean; // Trạng thái loading khi fetch data
  onUpdated?: () => void; // Callback sau khi update thành công
}

/**
 * Interface cho giá trị nguyên liệu trong form
 */
interface FormIngredientValue {
  name: string; // Tên nguyên liệu
  weight: number; // Trọng lượng (gram)
  calories: number; // Calories
  carbs: number; // Carbohydrates (gram)
  protein: number; // Protein (gram)
  fat: number; // Fat (gram)
  foodId: string | null; // ID của nguyên liệu từ API (có thể null)
}

/**
 * Interface cho giá trị session (bữa ăn) trong form
 */
interface FormSessionValue {
  sessionName: string; // Tên bữa ăn (ví dụ: "Bữa sáng", "Bữa trưa")
  ingredients: FormIngredientValue[]; // Danh sách nguyên liệu trong bữa ăn
}

/**
 * Interface cho giá trị menu trong form
 */
interface FormMenuValue {
  id: string; // ID của menu
  mealDemoId: string; // ID của meal plan
  menuNumber: number; // Số thứ tự menu (1, 2, 3...)
  sessions: FormSessionValue[]; // Danh sách các bữa ăn trong menu
}

/**
 * Normalize data từ API format (MealDemoDetailMenu) sang form format (FormMenuValue)
 * 
 * Chuyển đổi cấu trúc dữ liệu từ API để phù hợp với form structure:
 * - Giữ nguyên id, mealDemoId, menuNumber
 * - Map sessions và ingredients
 * - Xử lý foodId: nếu null/undefined thì convert thành empty string
 * 
 * @param menus - Danh sách menus từ API
 * @returns Danh sách menus đã được normalize cho form
 */
const normalizeMenus = (menus: MealDemoDetailMenu[]): FormMenuValue[] => {
  console.log('normalizeMenus - input menus:', menus);
  const normalized = menus.map((menu) => {
    console.log(`normalizeMenus - Menu ${menu.menuNumber}:`, {
      id: menu.id,
      mealDemoId: menu.mealDemoId,
      menuNumber: menu.menuNumber,
      sessionsCount: menu.sessions?.length || 0,
      sessions: menu.sessions,
    });
    
    return {
      id: menu.id,
      mealDemoId: menu.mealDemoId,
      menuNumber: menu.menuNumber,
      sessions: (menu.sessions || []).map((session) => {
        console.log(`normalizeMenus - Session "${session.sessionName}":`, {
          sessionName: session.sessionName,
          ingredientsCount: session.ingredients?.length || 0,
          ingredients: session.ingredients,
        });
        
        return {
          sessionName: session.sessionName,
          ingredients: (session.ingredients || []).map((ingredient) => {
            // Log để debug
            console.log(`normalizeMenus - Ingredient:`, {
              name: ingredient.name,
              foodId: ingredient.foodId,
              foodIdType: typeof ingredient.foodId,
              foodIdIsNull: ingredient.foodId === null,
              foodIdIsUndefined: ingredient.foodId === undefined,
            });
            
            return {
              name: ingredient.name,
              weight: ingredient.weight,
              calories: ingredient.calories,
              carbs: ingredient.carbs,
              protein: ingredient.protein,
              fat: ingredient.fat,
              // Giữ nguyên foodId, không convert null thành empty string
              foodId: ingredient.foodId ?? '',
            };
          }),
        };
      }),
    };
  });
  
  console.log('normalizeMenus - output normalized:', normalized);
  return normalized;
};

const MealPlanDetailUpdateModal: React.FC<MealPlanDetailUpdateModalProps> = ({
  isOpen,
  onClose,
  mealDemoId,
  menus,
  isLoading,
  onUpdated,
}) => {
  // Form instance để quản lý form state
  const [form] = Form.useForm<{ menus: FormMenuValue[] }>();
  
  // Hook để update meal plan detail
  const { mutateAsync: updateMealDemoDetail, isPending } = useUpdateMealDemoDetail();
  
  // State để lưu menus đã được xử lý cho form (có thể đã được merge với watched values)
  const [formMenus, setFormMenus] = React.useState<FormMenuValue[]>([]);
  
  // Normalize menus từ props sang form format (memoized để tránh re-calculate không cần thiết)
  const normalizedMenus = React.useMemo(() => normalizeMenus(menus), [menus]);
  
  // State cho search nguyên liệu
  const [ingredientSearchTerm, setIngredientSearchTerm] = React.useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState('');

  /**
   * Debounce search term để tránh gọi API quá nhiều khi user đang gõ
   * Delay 400ms sau khi user ngừng gõ mới update debouncedSearchTerm
   */
  React.useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedSearchTerm(ingredientSearchTerm.trim());
    }, 400);
    return () => clearTimeout(handle);
  }, [ingredientSearchTerm]);

  /**
   * Search params cho API tìm kiếm nguyên liệu
   * Chỉ gọi API search khi user nhập ít nhất 2 ký tự
   */
  const searchParams = React.useMemo(() => {
    if (debouncedSearchTerm.length < 2) {
      return undefined;
    }
    return {
      query: debouncedSearchTerm,
      pageNumber: 0,
      maxResults: 50,
    };
  }, [debouncedSearchTerm]);

  /**
   * Base params để load danh sách nguyên liệu mặc định (không có search query)
   * Load khi modal mở để hiển thị danh sách ban đầu
   */
  const baseParams = React.useMemo(
    () => ({
      pageNumber: 0,
      maxResults: 50,
    }),
    []
  );

  /**
   * Fetch danh sách nguyên liệu mặc định (khi không có search)
   * Chỉ fetch khi modal mở
   */
  const {
    data: baseIngredientData,
    isFetching: isLoadingBaseIngredients,
  } = useSearchMealIngredients(baseParams, {
    enabled: isOpen,
    staleTime: 5 * 60 * 1000, // Cache 5 phút
  });

  /**
   * Fetch danh sách nguyên liệu khi user search
   * Chỉ fetch khi có searchParams (user đã nhập ít nhất 2 ký tự)
   */
  const {
    data: ingredientSearchData,
    isFetching: isSearchingIngredients,
  } = useSearchMealIngredients(searchParams ?? baseParams, {
    enabled: isOpen && Boolean(searchParams),
    staleTime: 60 * 1000, // Cache 1 phút
  });

  /**
   * Parse giá trị số từ string (ví dụ: "100 kcal" -> 100)
   * Dùng để parse calories, carbs, protein, fat từ API response
   */
  const parseNumericValue = (value?: string) => {
    if (!value) return 0;
    const match = value.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  };

  /**
   * Parse trọng lượng từ string (ví dụ: "100g" hoặc "100 gram" -> 100)
   * Dùng để parse weight từ API response
   */
  const parseWeightInGrams = (value?: string) => {
    if (!value) return 0;
    const match = value.match(/([\d.]+)\s*(g|gram|grams)?/i);
    return match ? parseFloat(match[1]) : 0;
  };

  /**
   * Tạo danh sách options cho Select nguyên liệu
   * 
   * Bao gồm:
   * 1. Options từ API (từ baseIngredientData hoặc ingredientSearchData)
   * 2. Options từ nguyên liệu hiện tại trong form (để đảm bảo Select hiển thị đúng giá trị ban đầu)
   * 
   * Logic:
   * - Parse data từ API format sang format cho Select
   * - Thêm các nguyên liệu hiện tại vào options nếu chưa có trong API
   * - Nếu nguyên liệu có name nhưng không có foodId, tạo option tạm
   */
  const ingredientOptions = React.useMemo(() => {
    // Chọn data source: nếu có search thì dùng searchData, không thì dùng baseData
    const data = searchParams ? ingredientSearchData : baseIngredientData;
    const foods = data?.data?.foods ?? [];
    
    // Map foods từ API sang format cho Select
    const optionsFromApi = foods.map((food: any) => {
      const baseWeight = parseWeightInGrams(food.weight) || 100;
      const normalizedFood = {
        id: food.food_id,
        name: food.food_name,
        baseWeight,
        calories: parseNumericValue(food.calories),
        carbs: parseNumericValue(food.carbs),
        protein: parseNumericValue(food.protein),
        fat: parseNumericValue(food.fat),
        url: food.food_url,
      };
      
      return {
        label: food.food_name,
        value: food.food_id,
        food: normalizedFood,
      };
    });

    // Thêm các nguyên liệu hiện tại từ normalizedMenus vào options nếu chưa có
    const currentIngredients: any[] = [];
    if (normalizedMenus.length > 0) {
      normalizedMenus.forEach((menu) => {
        menu.sessions.forEach((session) => {
          session.ingredients.forEach((ing) => {
            // Chấp nhận cả foodId là null/undefined hoặc empty string, nhưng phải có name
            const hasFoodId = ing.foodId !== null && ing.foodId !== undefined && ing.foodId !== '';
            if (hasFoodId && ing.name) {
              // Kiểm tra xem đã có trong options chưa
              const exists = optionsFromApi.some((opt: any) => opt.value === ing.foodId);
              if (!exists && !currentIngredients.some((ci: any) => ci.value === ing.foodId)) {
                currentIngredients.push({
                  label: ing.name,
                  value: ing.foodId,
                  food: {
                    id: ing.foodId,
                    name: ing.name,
                    baseWeight: ing.weight || 100,
                    calories: ing.calories || 0,
                    carbs: ing.carbs || 0,
                    protein: ing.protein || 0,
                    fat: ing.fat || 0,
                  },
                });
              }
            } else if (ing.name && !hasFoodId) {
              // Nếu có name nhưng không có foodId, tạo một option tạm với name làm value
              const tempValue = `temp_${ing.name}_${Date.now()}`;
              if (!currentIngredients.some((ci: any) => ci.label === ing.name)) {
                currentIngredients.push({
                  label: ing.name,
                  value: tempValue,
                  food: {
                    id: tempValue,
                    name: ing.name,
                    baseWeight: ing.weight || 100,
                    calories: ing.calories || 0,
                    carbs: ing.carbs || 0,
                    protein: ing.protein || 0,
                    fat: ing.fat || 0,
                  },
                });
              }
            }
          });
        });
      });
    }
    
    console.log('ingredientOptions - currentIngredients:', currentIngredients);
    console.log('ingredientOptions - optionsFromApi:', optionsFromApi);
    console.log('ingredientOptions - final options:', [...currentIngredients, ...optionsFromApi]);

    return [...currentIngredients, ...optionsFromApi];
  }, [baseIngredientData, ingredientSearchData, searchParams, normalizedMenus]);

  const isLoadingIngredients = isLoadingBaseIngredients || isSearchingIngredients;

  /**
   * Effect: Khởi tạo form khi modal mở
   * 
   * Khi modal mở:
   * - Reset form và state
   * - Set form values từ normalizedMenus
   * - Log form values để debug
   * 
   * Khi modal đóng:
   * - Reset form
   * - Clear state
   */
  React.useEffect(() => {
    if (!isOpen) {
      form.resetFields();
      setFormMenus([]);
      setIngredientSearchTerm('');
      return;
    }

    if (normalizedMenus.length > 0) {
      console.log('Setting form fields with normalizedMenus:', normalizedMenus);
      
      // Đợi ingredientOptions được load xong rồi mới set form
      // Nếu foodId là empty string, tìm option theo name và cập nhật foodId
      const menusWithFixedFoodIds = normalizedMenus.map((menu) => ({
        ...menu,
        sessions: menu.sessions.map((session) => ({
          ...session,
          ingredients: session.ingredients.map((ing) => {
            // Nếu foodId là empty string hoặc null, nhưng có name, tìm option theo name
            if ((!ing.foodId || ing.foodId === '') && ing.name) {
              // Tìm trong ingredientOptions (sẽ được tính sau khi API load xong)
              // Tạm thời giữ nguyên, sẽ fix sau khi options load
              return ing;
            }
            return ing;
          }),
        })),
      }));
      
      form.setFieldsValue({
        menus: menusWithFixedFoodIds,
      });
      setFormMenus(menusWithFixedFoodIds);
      
      // Log để kiểm tra form values sau khi set
      setTimeout(() => {
        const formValues = form.getFieldsValue();
        console.log('Form values after setFieldsValue:', formValues);
        console.log('Form values - menus:', formValues.menus);
        if (formValues.menus && formValues.menus.length > 0) {
          formValues.menus.forEach((menu: any, mi: number) => {
            if (menu.sessions) {
              menu.sessions.forEach((session: any, si: number) => {
                if (session.ingredients) {
                  session.ingredients.forEach((ing: any, ii: number) => {
                    console.log(`Form value - Menu ${mi}, Session ${si}, Ingredient ${ii}:`, {
                      foodId: ing.foodId,
                      name: ing.name,
                    });
                  });
                }
              });
            }
          });
        }
      }, 100);
    }
  }, [isOpen, normalizedMenus, form]);

  /**
   * Watch form values để sync với formMenus state
   * Dùng để lấy giá trị real-time từ form khi user thay đổi
   */
  const watchedMenus = Form.useWatch('menus', form);

  /**
   * Effect: Tự động fix foodId khi ingredientOptions đã load
   * 
   * Vấn đề: Một số nguyên liệu có foodId là empty string nhưng có name
   * Giải pháp: Tìm option theo name và cập nhật foodId trong form
   * 
   * Chạy khi:
   * - Modal mở
   * - ingredientOptions đã load (có options)
   * - normalizedMenus và formMenus có data
   */
  React.useEffect(() => {
    if (isOpen && ingredientOptions.length > 0 && normalizedMenus.length > 0 && formMenus.length > 0) {
      let needsUpdate = false;
      const updatedMenus = formMenus.map((menu, menuIndex) => ({
        ...menu,
        sessions: menu.sessions.map((session, sessionIndex) => ({
          ...session,
          ingredients: session.ingredients.map((ing, ingredientIndex) => {
            // Nếu foodId là empty string nhưng có name, tìm option theo name
            if ((!ing.foodId || ing.foodId === '') && ing.name) {
              const foundOption = ingredientOptions.find(
                (opt: any) => opt.label === ing.name || opt.food?.name === ing.name
              );
              if (foundOption) {
                console.log(`Fixing foodId for "${ing.name}": empty -> ${foundOption.value}`);
                needsUpdate = true;
                return {
                  ...ing,
                  foodId: foundOption.value,
                };
              }
            }
            return ing;
          }),
        })),
      }));

      if (needsUpdate) {
        console.log('Updating form with fixed foodIds:', updatedMenus);
        form.setFieldsValue({
          menus: updatedMenus,
        });
        setFormMenus(updatedMenus);
      }
    }
  }, [isOpen, ingredientOptions, normalizedMenus, formMenus, form]);

  /**
   * Effect: Merge watchedMenus với normalizedMenus để đảm bảo data đầy đủ
   * 
   * Vấn đề: watchedMenus có thể thiếu một số field quan trọng (id, mealDemoId, menuNumber, sessionName)
   * Giải pháp: Merge với normalizedMenus gốc để giữ lại các field này
   * 
   * Đặc biệt quan trọng: sessionName phải được giữ lại vì API yêu cầu field này
   */
  React.useEffect(() => {
    if (Array.isArray(watchedMenus) && watchedMenus.length > 0) {
      // Đảm bảo sessions được giữ nguyên từ normalizedMenus gốc, đặc biệt là sessionName
      const mergedMenus = watchedMenus.map((watchedMenu, index) => {
        const originalMenu = normalizedMenus[index];
        if (originalMenu) {
          // Merge sessions, đảm bảo sessionName được giữ lại
          const mergedSessions = (watchedMenu.sessions && watchedMenu.sessions.length > 0 
            ? watchedMenu.sessions 
            : originalMenu.sessions
          ).map((watchedSession: any, sessionIndex: number) => {
            const originalSession = originalMenu.sessions[sessionIndex];
            return {
              ...watchedSession,
              // Đảm bảo sessionName luôn được giữ lại từ original
              sessionName: watchedSession.sessionName || originalSession?.sessionName || '',
            };
          });

          return {
            ...watchedMenu,
            id: originalMenu.id,
            mealDemoId: originalMenu.mealDemoId,
            menuNumber: originalMenu.menuNumber,
            sessions: mergedSessions,
          };
        }
        return watchedMenu;
      });
      setFormMenus(mergedMenus);
    } else if (normalizedMenus.length > 0) {
      // Nếu watchedMenus rỗng nhưng normalizedMenus có data, dùng normalizedMenus
      setFormMenus(normalizedMenus);
    }
  }, [watchedMenus, normalizedMenus]);

  /**
   * Handler: Đóng modal và reset form
   */
  const handleCancel = () => {
    form.resetFields();
    setFormMenus([]);
    setIngredientSearchTerm('');
    onClose();
  };

  /**
   * Handler: Submit form để update meal plan detail
   * 
   * Flow:
   * 1. Validate form
   * 2. Transform form values sang API payload format
   * 3. Gửi API update cho từng menu
   * 4. Hiển thị toast success/error
   * 5. Gọi onUpdated callback và đóng modal
   * 
   * Lưu ý:
   * - Đảm bảo sessionName luôn có giá trị (required bởi API)
   * - Chỉ gửi ingredients có name và foodId
   * - Gửi từng menu một (loop qua menuValues)
   */
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      console.log('Submitting meal plan detail update form values:', values);

      if (!mealDemoId) {
        toast.error('Thiếu mã kế hoạch dinh dưỡng.');
        return;
      }

      const menuValues = values.menus ?? [];
      if (!menuValues.length) {
        toast.error('Không có dữ liệu thực đơn để cập nhật.');
        return;
      }

      for (const menu of menuValues) {
        if (!menu.id || typeof menu.menuNumber !== 'number' || menu.menuNumber <= 0) {
          console.error(`Invalid menu value:`, menu);
          toast.error(`Thực đơn ${menu.menuNumber || 'undefined'} không hợp lệ. Vui lòng thử lại.`);
          continue;
        }

        console.log(`Processing Menu ${menu.menuNumber} - Raw menu data:`, menu);

        /**
         * Transform sessions từ form format sang API payload format
         * 
         * Quan trọng:
         * - sessionName: Phải có giá trị (required bởi API)
         *   + Ưu tiên lấy từ form values (session.sessionName)
         *   + Nếu không có, lấy từ normalizedMenus gốc
         *   + Nếu vẫn không có, log error
         * 
         * - ingredients: Chỉ gửi những ingredient có đầy đủ name và foodId
         */
        const sessions: UpdateMealDemoSessionPayload[] = (menu.sessions ?? []).map((session, sessionIndex) => {
          // Đảm bảo sessionName luôn có giá trị - ưu tiên từ form values, sau đó từ normalizedMenus
          const sessionName = session.sessionName || 
            normalizedMenus.find(m => m.id === menu.id)?.sessions[sessionIndex]?.sessionName || 
            '';
          
          if (!sessionName) {
            console.error(`Menu ${menu.menuNumber} - Session ${sessionIndex} missing sessionName`);
            console.error('Session data:', session);
            console.error('Menu data:', menu);
            console.error('Normalized menus:', normalizedMenus);
          }

          // Filter và map ingredients: chỉ lấy những ingredient có name và foodId
          const ingredients: UpdateMealDemoIngredientPayload[] = (session.ingredients ?? [])
            .filter((ingredient) => ingredient.name && ingredient.foodId)
            .map((ingredient) => ({
              name: ingredient.name,
              weight: ingredient.weight ?? 0,
              calories: ingredient.calories ?? 0,
              carbs: ingredient.carbs ?? 0,
              protein: ingredient.protein ?? 0,
              fat: ingredient.fat ?? 0,
              foodId: ingredient.foodId || '',
            }));

          return {
            sessionName: sessionName,
            ingredients,
          };
        });

        const menuPayload: UpdateMealDemoDetailPayload = {
          id: menu.id,
          mealDemoId: menu.mealDemoId,
          menuNumber: menu.menuNumber,
          sessions,
        };

        console.log(`Menu ${menu.menuNumber} - Sending payload:`, menuPayload);

        const response = await updateMealDemoDetail({
          id: menu.id,
          payload: menuPayload,
        });

        console.log(`Menu ${menu.menuNumber} - Update response:`, {
          id: menu.id,
          menuPayload,
          response,
        });

        if (!response.success) {
          throw new Error(response.message || `Không thể cập nhật thực đơn ${menu.menuNumber}`);
        }
      }

      toast.success('Cập nhật thực đơn thành công!');
      onUpdated?.();
      handleCancel();
    } catch (error) {
      if (error && (error as any).errorFields) {
        return;
      }
      console.error('Failed to update meal plan detail', error);
      toast.error('Không thể cập nhật thực đơn. Vui lòng thử lại.');
    }
  };

  /**
   * Chọn data source để render:
   * - Ưu tiên formMenus (đã được merge với watched values)
   * - Nếu formMenus rỗng, dùng normalizedMenus
   */
  const menusValue = formMenus.length > 0 ? formMenus : normalizedMenus;
  const hasMenus = menusValue.length > 0;

  /**
   * Effect: Debug log để theo dõi data flow
   * Log các state quan trọng khi modal mở để debug
   */
  React.useEffect(() => {
    if (isOpen) {
      console.log('MealPlanDetailUpdateModal - menus prop:', menus);
      console.log('MealPlanDetailUpdateModal - normalizedMenus:', normalizedMenus);
      console.log('MealPlanDetailUpdateModal - formMenus:', formMenus);
      console.log('MealPlanDetailUpdateModal - watchedMenus:', watchedMenus);
      console.log('MealPlanDetailUpdateModal - menusValue:', menusValue);
    }
  }, [isOpen, menus, normalizedMenus, formMenus, watchedMenus, menusValue]);

  return (
    <Modal
      title="Cập nhật thực đơn theo menu"
      isOpen={isOpen}
      onClose={handleCancel}
      size="xl"
    >
      {/* Loading state: Hiển thị khi đang fetch data */}
      {isLoading && (
        <Flex gap={8} align="center" style={{ marginBottom: 16, color: 'var(--text-secondary)' }}>
          <Icon name="mdi:loading" size={20} color="var(--primary)" />
          <span>Đang tải dữ liệu thực đơn...</span>
        </Flex>
      )}

      {/* Empty state: Hiển thị khi không có menus */}
      {!hasMenus && !isLoading ? (
        <div style={{ padding: '24px 0', color: 'var(--text-secondary)', textAlign: 'center' }}>
          Không có thực đơn nào để cập nhật.
        </div>
      ) : (
        <Form form={form} layout="vertical">
          {/* Render từng menu */}
          {menusValue.map((menu, menuIndex) => {
            const sessions = menu.sessions ?? [];
            const menuLabel = `Thực đơn ${menu.menuNumber}`;

            return (
              <Card
                key={menu.menuNumber}
                style={{
                  marginBottom: 16,
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                }}
                styles={{ body: { padding: 20 } }}
              >
                {/* 
                  Hidden fields để lưu các giá trị cần thiết trong form state:
                  - id: ID của menu (dùng để gửi API)
                  - mealDemoId: ID của meal plan
                  - menuNumber: Số thứ tự menu
                  Các field này không hiển thị nhưng cần có trong form để submit
                */}
                <Form.Item name={['menus', menuIndex, 'id']} hidden>
                  <Input type="hidden" />
                </Form.Item>
                <Form.Item name={['menus', menuIndex, 'mealDemoId']} hidden>
                  <Input type="hidden" />
                </Form.Item>
                <Form.Item name={['menus', menuIndex, 'menuNumber']} hidden>
                  <Input type="hidden" />
                </Form.Item>

                <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 18, color: 'var(--text)' }}>{menuLabel}</h3>
                    <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: 13 }}>
                      Cập nhật thông tin nguyên liệu cho thực đơn này.
                    </p>
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    {sessions.length} bữa ăn
                  </span>
                </Flex>

                {/* Empty state cho sessions: Hiển thị khi menu chưa có bữa ăn nào */}
                {!sessions.length ? (
                  <div style={{ padding: 12, color: 'var(--text-secondary)' }}>
                    Thực đơn này chưa có bữa ăn nào.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {/* Render từng session (bữa ăn) */}
                    {sessions.map((session, sessionIndex) => {
                      const ingredients = session.ingredients ?? [];
                      const sessionLabel = session.sessionName || `Bữa ${sessionIndex + 1}`;

                      return (
                        <div
                          key={sessionIndex}
                          style={{
                            padding: '16px',
                            border: '1px solid var(--border)',
                            borderRadius: 12,
                            backgroundColor: 'var(--bg-secondary)',
                          }}
                        >
                          {/* 
                            Hidden field để lưu sessionName trong form state
                            Quan trọng: sessionName là required field khi submit API
                          */}
                          <Form.Item name={['menus', menuIndex, 'sessions', sessionIndex, 'sessionName']} hidden>
                            <Input type="hidden" />
                          </Form.Item>

                          <h4 style={{ margin: '0 0 16px', fontSize: 16, color: 'var(--text)' }}>
                            {sessionLabel}
                          </h4>

                          {/* Empty state cho ingredients: Hiển thị khi session chưa có nguyên liệu */}
                          {!ingredients.length ? (
                            <div style={{ padding: 12, color: 'var(--text-secondary)' }}>
                              Bữa này chưa có nguyên liệu nào.
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                              {/* Render từng nguyên liệu với form fields để chỉnh sửa */}
                              {ingredients.map((ingredient, ingredientIndex) => {
                                /**
                                 * Lấy foodId hiện tại:
                                 * - Ưu tiên từ watchedMenus (form state real-time)
                                 * - Nếu không có, dùng từ ingredient (initial value)
                                 */
                                const watchedFoodId = watchedMenus?.[menuIndex]?.sessions?.[sessionIndex]?.ingredients?.[ingredientIndex]?.foodId;
                                const currentFoodId = watchedFoodId || ingredient.foodId;
                                
                                /**
                                 * Tìm option tương ứng trong ingredientOptions
                                 * Tìm theo foodId hoặc name để đảm bảo Select hiển thị đúng
                                 */
                                const currentIngredientOption = ingredientOptions.find(
                                  (opt: any) => opt.value === currentFoodId || opt.label === ingredient.name
                                );

                                // Debug log
                                console.log(`Ingredient ${ingredientIndex} - ingredient.foodId:`, ingredient.foodId);
                                console.log(`Ingredient ${ingredientIndex} - watchedFoodId:`, watchedFoodId);
                                console.log(`Ingredient ${ingredientIndex} - currentFoodId:`, currentFoodId);
                                console.log(`Ingredient ${ingredientIndex} - name:`, ingredient.name);
                                console.log(`Ingredient ${ingredientIndex} - currentOption:`, currentIngredientOption);
                                console.log(`Ingredient ${ingredientIndex} - options count:`, ingredientOptions.length);
                                if (currentIngredientOption) {
                                  console.log(`Ingredient ${ingredientIndex} - option found:`, currentIngredientOption.label);
                                } else {
                                  console.warn(`Ingredient ${ingredientIndex} - NO OPTION FOUND for foodId:`, currentFoodId);
                                }

                                return (
                                  <div
                                    key={ingredientIndex}
                                    style={{
                                      display: 'grid',
                                      gridTemplateColumns: '2fr repeat(5, 1fr)',
                                      gap: 12,
                                      alignItems: 'flex-end',
                                      padding: '12px',
                                      border: '1px solid var(--border)',
                                      borderRadius: 8,
                                      backgroundColor: 'var(--bg)',
                                    }}
                                  >
                                    {/* 
                                      Form field: Chọn nguyên liệu
                                      - Required: Phải chọn nguyên liệu
                                      - Select với search: Cho phép tìm kiếm nguyên liệu
                                      - Auto-update: Khi chọn nguyên liệu mới, tự động tính lại giá trị dinh dưỡng
                                    */}
                                    <Form.Item
                                      name={['menus', menuIndex, 'sessions', sessionIndex, 'ingredients', ingredientIndex, 'foodId']}
                                      label="Nguyên liệu"
                                      rules={[{ required: true, message: 'Vui lòng chọn nguyên liệu' }]}
                                      style={{ marginBottom: 0 }}
                                    >
                                      <Select
                                        placeholder="Chọn nguyên liệu"
                                        showSearch
                                        filterOption={false}
                                        options={ingredientOptions}
                                        onSearch={setIngredientSearchTerm}
                                        loading={isLoadingIngredients}
                                        allowClear
                                        /**
                                         * Set value cho Select:
                                         * - Nếu có currentFoodId và không rỗng -> dùng currentFoodId
                                         * - Nếu foodId rỗng nhưng có name và tìm được option -> dùng value của option
                                         * - Nếu không -> undefined (Select sẽ hiển thị placeholder)
                                         * 
                                         * Logic này đảm bảo Select luôn hiển thị đúng nguyên liệu ban đầu
                                         */
                                        value={(() => {
                                          if (currentFoodId && currentFoodId !== '') {
                                            return currentFoodId;
                                          }
                                          // Nếu foodId empty nhưng có name, tìm option theo name
                                          if (ingredient.name && currentIngredientOption) {
                                            return currentIngredientOption.value;
                                          }
                                          return undefined;
                                        })()}
                                        notFoundContent={
                                          ingredientSearchTerm.length > 0 && ingredientSearchTerm.length < 2
                                            ? 'Nhập ít nhất 2 ký tự để tìm kiếm nguyên liệu'
                                            : isLoadingIngredients
                                            ? 'Đang tải nguyên liệu...'
                                            : 'Không tìm thấy nguyên liệu phù hợp'
                                        }
                                        /**
                                         * Handler khi user chọn nguyên liệu mới
                                         * 
                                         * Khi chọn nguyên liệu:
                                         * 1. Tìm option tương ứng
                                         * 2. Lấy baseWeight của nguyên liệu
                                         * 3. Lấy trọng lượng hiện tại từ form (hoặc dùng baseWeight)
                                         * 4. Tính toán lại giá trị dinh dưỡng dựa trên tỷ lệ: (currentWeight / baseWeight)
                                         * 5. Cập nhật form values: foodId, name, calories, carbs, protein, fat
                                         */
                                        onChange={(value) => {
                                          const selectedOption = ingredientOptions.find((opt: any) => opt.value === value);
                                          if (selectedOption && selectedOption.food) {
                                            const food = selectedOption.food;
                                            const baseWeight = food.baseWeight || 100;
                                            const currentWeightPath: any = ['menus', menuIndex, 'sessions', sessionIndex, 'ingredients', ingredientIndex, 'weight'];
                                            const currentWeight = form.getFieldValue(currentWeightPath) || baseWeight;

                                            /**
                                             * Tính toán lại giá trị dinh dưỡng:
                                             * multiplier = currentWeight / baseWeight
                                             * Ví dụ: baseWeight = 100g, currentWeight = 200g -> multiplier = 2
                                             * -> calories = food.calories * 2
                                             */
                                            const multiplier = baseWeight > 0 ? currentWeight / baseWeight : 1;
                                            const calories = Math.round(food.calories * multiplier);
                                            const carbs = Math.round(food.carbs * multiplier * 10) / 10;
                                            const protein = Math.round(food.protein * multiplier * 10) / 10;
                                            const fat = Math.round(food.fat * multiplier * 10) / 10;

                                            // Cập nhật form values với giá trị mới
                                            form.setFieldsValue({
                                              menus: form.getFieldValue('menus')?.map((m: FormMenuValue, mi: number) => {
                                                if (mi !== menuIndex) return m;
                                                return {
                                                  ...m,
                                                  sessions: m.sessions.map((s: FormSessionValue, si: number) => {
                                                    if (si !== sessionIndex) return s;
                                                    return {
                                                      ...s,
                                                      ingredients: s.ingredients.map((ing: FormIngredientValue, ii: number) => {
                                                        if (ii !== ingredientIndex) return ing;
                                                        return {
                                                          ...ing,
                                                          foodId: value,
                                                          name: food.name,
                                                          calories: Number.isFinite(calories) ? calories : 0,
                                                          carbs: Number.isFinite(carbs) ? carbs : 0,
                                                          protein: Number.isFinite(protein) ? protein : 0,
                                                          fat: Number.isFinite(fat) ? fat : 0,
                                                        };
                                                      }),
                                                    };
                                                  }),
                                                };
                                              }),
                                            });
                                          }
                                        }}
                                      />
                                    </Form.Item>
                                    {/* Hidden field: Lưu name của nguyên liệu trong form state */}
                                    <Form.Item
                                      name={['menus', menuIndex, 'sessions', sessionIndex, 'ingredients', ingredientIndex, 'name']}
                                      hidden
                                    >
                                      <Input type="hidden" />
                                    </Form.Item>

                                  {/* 
                                    Form field: Trọng lượng nguyên liệu
                                    - Range: 1-5000g
                                    - Auto-update: Khi thay đổi trọng lượng, tự động tính lại giá trị dinh dưỡng
                                  */}
                                  <Form.Item
                                    name={['menus', menuIndex, 'sessions', sessionIndex, 'ingredients', ingredientIndex, 'weight']}
                                    label="Trọng lượng (g)"
                                    rules={[{ type: 'number', min: 1, max: 5000, message: '1 - 5000g' }]}
                                    style={{ marginBottom: 0 }}
                                  >
                                    <InputNumber
                                      min={1}
                                      max={5000}
                                      style={{ width: '100%' }}
                                      addonAfter="g"
                                      /**
                                       * Handler khi user thay đổi trọng lượng
                                       * 
                                       * Khi thay đổi trọng lượng:
                                       * 1. Lấy foodId hiện tại từ form
                                       * 2. Tìm option tương ứng
                                       * 3. Tính toán lại giá trị dinh dưỡng dựa trên trọng lượng mới
                                       * 4. Cập nhật calories, carbs, protein, fat trong form
                                       */
                                      onChange={(value) => {
                                        const currentFoodIdPath: any = ['menus', menuIndex, 'sessions', sessionIndex, 'ingredients', ingredientIndex, 'foodId'];
                                        const currentFoodId = form.getFieldValue(currentFoodIdPath);
                                        
                                        if (currentFoodId && value) {
                                          const selectedOption = ingredientOptions.find((opt: any) => opt.value === currentFoodId);
                                          if (selectedOption && selectedOption.food) {
                                            const food = selectedOption.food;
                                            const baseWeight = food.baseWeight || 100;
                                            
                                            /**
                                             * Tính toán lại giá trị dinh dưỡng:
                                             * multiplier = newWeight / baseWeight
                                             * Ví dụ: baseWeight = 100g, newWeight = 150g -> multiplier = 1.5
                                             * -> calories = food.calories * 1.5
                                             */
                                            const multiplier = baseWeight > 0 ? Number(value) / baseWeight : 1;
                                            const calories = Math.round(food.calories * multiplier);
                                            const carbs = Math.round(food.carbs * multiplier * 10) / 10;
                                            const protein = Math.round(food.protein * multiplier * 10) / 10;
                                            const fat = Math.round(food.fat * multiplier * 10) / 10;

                                            // Cập nhật các giá trị dinh dưỡng trong form
                                            form.setFieldsValue({
                                              [`menus.${menuIndex}.sessions.${sessionIndex}.ingredients.${ingredientIndex}.calories`]: Number.isFinite(calories) ? calories : 0,
                                              [`menus.${menuIndex}.sessions.${sessionIndex}.ingredients.${ingredientIndex}.carbs`]: Number.isFinite(carbs) ? carbs : 0,
                                              [`menus.${menuIndex}.sessions.${sessionIndex}.ingredients.${ingredientIndex}.protein`]: Number.isFinite(protein) ? protein : 0,
                                              [`menus.${menuIndex}.sessions.${sessionIndex}.ingredients.${ingredientIndex}.fat`]: Number.isFinite(fat) ? fat : 0,
                                            });
                                          }
                                        }
                                      }}
                                    />
                                  </Form.Item>

                                  {/* 
                                    Form fields: Giá trị dinh dưỡng
                                    - Calories: Số nguyên (kcal)
                                    - Carbs, Protein, Fat: Số thập phân 1 chữ số (gram)
                                    - Có thể chỉnh sửa thủ công hoặc tự động tính khi thay đổi nguyên liệu/trọng lượng
                                  */}
                                  <Form.Item
                                    name={['menus', menuIndex, 'sessions', sessionIndex, 'ingredients', ingredientIndex, 'calories']}
                                    label="Calories"
                                    rules={[{ type: 'number', min: 0, message: '≥ 0' }]}
                                    style={{ marginBottom: 0 }}
                                  >
                                    <InputNumber min={0} style={{ width: '100%' }} />
                                  </Form.Item>

                                  <Form.Item
                                    name={['menus', menuIndex, 'sessions', sessionIndex, 'ingredients', ingredientIndex, 'carbs']}
                                    label="Carbs (g)"
                                    rules={[{ type: 'number', min: 0, message: '≥ 0' }]}
                                    style={{ marginBottom: 0 }}
                                  >
                                    <InputNumber min={0} step={0.1} style={{ width: '100%' }} />
                                  </Form.Item>

                                  <Form.Item
                                    name={['menus', menuIndex, 'sessions', sessionIndex, 'ingredients', ingredientIndex, 'protein']}
                                    label="Protein (g)"
                                    rules={[{ type: 'number', min: 0, message: '≥ 0' }]}
                                    style={{ marginBottom: 0 }}
                                  >
                                    <InputNumber min={0} step={0.1} style={{ width: '100%' }} />
                                  </Form.Item>

                                  <Form.Item
                                    name={['menus', menuIndex, 'sessions', sessionIndex, 'ingredients', ingredientIndex, 'fat']}
                                    label="Fat (g)"
                                    rules={[{ type: 'number', min: 0, message: '≥ 0' }]}
                                    style={{ marginBottom: 0 }}
                                  >
                                    <InputNumber min={0} step={0.1} style={{ width: '100%' }} />
                                  </Form.Item>
                                </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })}

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Flex gap={12} justify="flex-end">
              <Button variant="secondary" size="md" onClick={handleCancel} disabled={isPending}>
                Hủy
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleSubmit}
                loading={isPending}
                disabled={isPending}
              >
                Hoàn tất
              </Button>
            </Flex>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default MealPlanDetailUpdateModal;

