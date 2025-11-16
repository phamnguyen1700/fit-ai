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
  return menus.map((menu) => ({
    id: menu.id,
    mealDemoId: menu.mealDemoId,
    menuNumber: menu.menuNumber,
    sessions: (menu.sessions || []).map((session) => ({
      sessionName: session.sessionName,
      ingredients: (session.ingredients || []).map((ingredient) => ({
        name: ingredient.name,
        weight: ingredient.weight,
        calories: ingredient.calories,
        carbs: ingredient.carbs,
        protein: ingredient.protein,
        fat: ingredient.fat,
        foodId: ingredient.foodId ?? '',
      })),
    })),
  }));
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
  
  // State để track form values trực tiếp (để đảm bảo update ngay lập tức)
  const [formMenusState, setFormMenusState] = React.useState<FormMenuValue[]>([]);
  
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

  const parseWeightInGrams = (value?: string) => {
    if (!value) return 0;
    const match = value.match(/([\d.]+)\s*(g|gram|grams)?/i);
    return match ? parseFloat(match[1]) : 0;
  };

  const calculateNutrition = (food: any, weight: number) => {
    const baseWeight = food.baseWeight || 100;
    const multiplier = baseWeight > 0 ? weight / baseWeight : 1;
    return {
      calories: Math.round(food.calories * multiplier),
      carbs: Math.round(food.carbs * multiplier * 10) / 10,
      protein: Math.round(food.protein * multiplier * 10) / 10,
      fat: Math.round(food.fat * multiplier * 10) / 10,
    };
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
              // Nếu có name nhưng không có foodId, tìm trong API options trước
              const foundInApi = optionsFromApi.find(
                (opt: any) => opt.label === ing.name || opt.food?.name === ing.name
              );
              
              if (foundInApi) {
                // Nếu tìm thấy trong API, dùng option đó
                if (!currentIngredients.some((ci: any) => ci.value === foundInApi.value)) {
                  currentIngredients.push(foundInApi);
                }
              } else {
                // Nếu không tìm thấy, tạo option tạm với value cố định dựa trên name
                const tempValue = `temp_${ing.name}`;
                if (!currentIngredients.some((ci: any) => ci.value === tempValue)) {
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
            }
          });
        });
      });
    }
    
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
  // Ref để track xem đã fix foodId chưa, tránh infinite loop
  const hasFixedFoodIds = React.useRef(false);

  React.useEffect(() => {
    if (!isOpen) {
      form.resetFields();
      setIngredientSearchTerm('');
      setFormMenusState([]);
      hasFixedFoodIds.current = false; // Reset khi modal đóng
      return;
    }

    if (normalizedMenus.length > 0) {
      const menusToSet = normalizedMenus.map((menu) => ({
        id: menu.id,
        mealDemoId: menu.mealDemoId,
        menuNumber: menu.menuNumber,
        sessions: (menu.sessions || []).map((session) => ({
          sessionName: session.sessionName,
          ingredients: (session.ingredients || []).map((ing) => ({
            name: ing.name || '',
            weight: ing.weight || 0,
            calories: ing.calories || 0,
            carbs: ing.carbs || 0,
            protein: ing.protein || 0,
            fat: ing.fat || 0,
            foodId: (!ing.foodId || ing.foodId === '') && ing.name ? `temp_${ing.name}` : ing.foodId || null,
          })),
        })),
      }));
      
      form.setFieldsValue({ menus: menusToSet });
      setFormMenusState(menusToSet);
    }
  }, [isOpen, normalizedMenus, form]);

  /**
   * Watch form values để sync với formMenus state
   * Dùng để lấy giá trị real-time từ form khi user thay đổi
   */
  const watchedMenus = Form.useWatch('menus', form);

  /**
   * Merge formMenusState với normalizedMenus để đảm bảo data đầy đủ
   * 
   * Vấn đề: formMenusState có thể thiếu một số field quan trọng (id, mealDemoId, menuNumber, sessionName)
   * Giải pháp: Merge với normalizedMenus gốc để giữ lại các field này
   * 
   * Đặc biệt quan trọng: 
   * - sessionName phải được giữ lại vì API yêu cầu field này
   * - Xử lý các session mới được thêm vào (không có trong normalizedMenus gốc)
   */
  const mergedMenus = React.useMemo(() => {
    if (!isOpen) return normalizedMenus;
    
    // Ưu tiên formMenusState (được update trực tiếp trong handlers)
    // Nếu formMenusState rỗng, dùng watchedMenus hoặc normalizedMenus
    let sourceMenus: FormMenuValue[] = [];
    
    if (formMenusState.length > 0) {
      sourceMenus = formMenusState;
    } else if (Array.isArray(watchedMenus) && watchedMenus.length > 0) {
      sourceMenus = watchedMenus;
    } else if (normalizedMenus.length > 0) {
      // Nếu cả formMenusState và watchedMenus đều rỗng, dùng normalizedMenus
      sourceMenus = normalizedMenus;
    }
    
    if (sourceMenus.length > 0) {
      return sourceMenus.map((menu, index) => {
        const originalMenu = normalizedMenus[index];
        if (originalMenu) {
          const menuSessions = menu.sessions || [];
          const originalSessions = originalMenu.sessions || [];
          
          const mergedSessions = menuSessions.map((session: any, sessionIndex: number) => {
            const originalSession = originalSessions[sessionIndex];
            const sessionName = session.sessionName || 
              originalSession?.sessionName || 
              `Bữa ${sessionIndex + 1}`;
            
            return {
              ...session,
              sessionName: sessionName,
            };
          });

          return {
            ...menu,
            id: originalMenu.id,
            mealDemoId: originalMenu.mealDemoId,
            menuNumber: originalMenu.menuNumber,
            sessions: mergedSessions,
          };
        }
        return menu;
      });
    }
    return normalizedMenus;
  }, [isOpen, formMenusState, watchedMenus, normalizedMenus]);

  /**
   * Effect: Tự động fix foodId khi ingredientOptions đã load
   * 
   * Vấn đề: Một số nguyên liệu có foodId là empty string nhưng có name
   * Giải pháp: Tìm option theo name và cập nhật foodId trong form
   * 
   * Chạy khi:
   * - Modal mở
   * - ingredientOptions đã load (có options)
   * - normalizedMenus và mergedMenus có data
   */
  React.useEffect(() => {
    // Fix foodId khi ingredientOptions đã load và có nguyên liệu cần fix
    if (!isOpen) {
      hasFixedFoodIds.current = false;
      return;
    }
    
    // Chỉ fix một lần khi ingredientOptions đã load đầy đủ
    if (hasFixedFoodIds.current) {
      return;
    }
    
    if (ingredientOptions.length > 0 && formMenusState.length > 0) {
      let needsUpdate = false;
      const updatedMenus = formMenusState.map((menu, menuIndex) => ({
        ...menu,
        sessions: (menu.sessions || []).map((session, sessionIndex) => ({
          ...session,
          ingredients: (session.ingredients || []).map((ing: FormIngredientValue, ingredientIndex: number) => {
            // Nếu foodId là null, empty string hoặc không có, nhưng có name, tìm option theo name
            if ((!ing.foodId || ing.foodId === '' || ing.foodId === null) && ing.name) {
              // Tìm option theo name (không phân biệt hoa thường)
              const foundOption = ingredientOptions.find(
                (opt: any) => 
                  opt.label?.toLowerCase() === ing.name?.toLowerCase() || 
                  opt.food?.name?.toLowerCase() === ing.name?.toLowerCase()
              );
              if (foundOption?.value) {
                needsUpdate = true;
                return { ...ing, foodId: foundOption.value };
              }
            }
            return ing;
          }),
        })),
      }));

      if (needsUpdate) {
        hasFixedFoodIds.current = true;
        form.setFieldsValue({ menus: updatedMenus });
        setFormMenusState(updatedMenus);
      } else {
        hasFixedFoodIds.current = true;
      }
    }
  }, [isOpen, ingredientOptions, formMenusState, form]);

  const updateMenusAndForm = (updatedMenus: FormMenuValue[]) => {
    form.setFieldsValue({ menus: updatedMenus });
    setFormMenusState(updatedMenus);
  };

  const handleAddIngredient = (menuIndex: number, sessionIndex: number) => {
    const currentMenus = formMenusState.length > 0 ? formMenusState : mergedMenus;
    const updatedMenus = currentMenus.map((menu, mi) => {
      if (mi !== menuIndex) return menu;
      return {
        ...menu,
        sessions: (menu.sessions || []).map((session, si) => {
          if (si !== sessionIndex) return session;
          return {
            ...session,
            ingredients: [...(session.ingredients || []), {
              name: '', weight: 100, calories: 0, carbs: 0, protein: 0, fat: 0, foodId: null,
            }],
          };
        }),
      };
    });
    updateMenusAndForm(updatedMenus);
  };

  const handleRemoveIngredient = (menuIndex: number, sessionIndex: number, ingredientIndex: number) => {
    const currentMenus = formMenusState.length > 0 ? formMenusState : mergedMenus;
    const updatedMenus = currentMenus.map((menu, mi) => {
      if (mi !== menuIndex) return menu;
      return {
        ...menu,
        sessions: (menu.sessions || []).map((session, si) => {
          if (si !== sessionIndex) return session;
          return {
            ...session,
            ingredients: (session.ingredients || []).filter((_: FormIngredientValue, ii: number) => ii !== ingredientIndex),
          };
        }),
      };
    });
    updateMenusAndForm(updatedMenus);
  };

  const handleAddSession = (menuIndex: number) => {
    const currentMenus = formMenusState.length > 0 ? formMenusState : mergedMenus;
    const menu = currentMenus[menuIndex];
    const updatedMenus = currentMenus.map((m, mi) => {
      if (mi !== menuIndex) return m;
      return {
        ...m,
        sessions: [...(m.sessions || []), { sessionName: `Bữa ${(m.sessions || []).length + 1}`, ingredients: [] }],
      };
    });
    updateMenusAndForm(updatedMenus);
  };

  const handleRemoveSession = (menuIndex: number, sessionIndex: number) => {
    const currentMenus = formMenusState.length > 0 ? formMenusState : mergedMenus;
    const updatedMenus = currentMenus.map((menu, mi) => {
      if (mi !== menuIndex) return menu;
      return {
        ...menu,
        sessions: (menu.sessions || []).filter((_, si) => si !== sessionIndex),
      };
    });
    updateMenusAndForm(updatedMenus);
  };

  /**
   * Handler: Đóng modal và reset form
   */
  const handleCancel = () => {
    form.resetFields();
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
          toast.error(`Thực đơn ${menu.menuNumber || 'undefined'} không hợp lệ. Vui lòng thử lại.`);
          continue;
        }

        /**
         * Transform sessions từ form format sang API payload format
         * 
         * Quan trọng:
         * - sessionName: Phải có giá trị (required bởi API)
         *   + Ưu tiên lấy từ form values (session.sessionName)
         *   + Nếu không có, lấy từ normalizedMenus gốc
         *   + Nếu vẫn không có, dùng tên mặc định "Bữa X"
         * 
         * - ingredients: Chỉ gửi những ingredient có đầy đủ name và foodId
         *   + Bỏ qua các ingredient mới chưa chọn (foodId null hoặc empty)
         */
        const sessions: UpdateMealDemoSessionPayload[] = (menu.sessions ?? [])
          .map((session, sessionIndex) => {
          // Đảm bảo sessionName luôn có giá trị - ưu tiên từ form values, sau đó từ normalizedMenus
            const originalMenu = normalizedMenus.find(m => m.id === menu.id);
          const sessionName = session.sessionName || 
              originalMenu?.sessions[sessionIndex]?.sessionName || 
              `Bữa ${sessionIndex + 1}`;
            
            // Filter và map ingredients: chỉ lấy những ingredient có name và foodId hợp lệ
          const ingredients: UpdateMealDemoIngredientPayload[] = (session.ingredients ?? [])
              .filter((ingredient) => {
                // Chỉ lấy ingredient có name và foodId không rỗng
                return ingredient.name && 
                       ingredient.foodId && 
                       ingredient.foodId !== null && 
                       ingredient.foodId !== '';
              })
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
          })
          // Chỉ gửi các session có ít nhất 1 ingredient hợp lệ
          .filter((session) => session.ingredients.length > 0);

        const response = await updateMealDemoDetail({
          id: menu.id,
          payload: {
            id: menu.id,
            mealDemoId: menu.mealDemoId,
            menuNumber: menu.menuNumber,
            sessions,
          },
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
   * - Sử dụng mergedMenus (đã được merge với watched values)
   * - Nếu mergedMenus rỗng, dùng normalizedMenus
   */
  const menusValue = mergedMenus.length > 0 ? mergedMenus : normalizedMenus;
  const hasMenus = menusValue.length > 0;


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

                <Flex justify="space-between" align="center" style={{ marginBottom: 20 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: 'var(--text)' }}>{menuLabel}</h3>
                    <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: 13 }}>
                      Cập nhật thông tin nguyên liệu cho thực đơn này.
                    </p>
                  </div>
                  <Flex gap={12} align="center">
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    {sessions.length} bữa ăn
                  </span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleAddSession(menuIndex)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 6,
                        border: '1px dashed var(--border)',
                      }}
                    >
                      <Icon name="mdi:plus" size={16} />
                      Thêm bữa ăn
                    </Button>
                  </Flex>
                </Flex>

                {/* Empty state cho sessions: Hiển thị khi menu chưa có bữa ăn nào */}
                {!sessions.length ? (
                  <div style={{ 
                    padding: 24, 
                    color: 'var(--text-secondary)', 
                    textAlign: 'center',
                    border: '1px dashed var(--border)',
                    borderRadius: 8,
                    backgroundColor: 'var(--bg-secondary)',
                  }}>
                    <div style={{ marginBottom: 8, opacity: 0.5 }}>
                      <Icon name="mdi:silverware-fork-knife" size={32} />
                    </div>
                    <p style={{ margin: 0 }}>Thực đơn này chưa có bữa ăn nào.</p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleAddSession(menuIndex)}
                      style={{ marginTop: 12, border: '1px dashed var(--border)' }}
                    >
                      <Flex gap={4} align="center">
                        <Icon name="mdi:plus" size={16} />
                        <span>Thêm bữa ăn đầu tiên</span>
                      </Flex>
                    </Button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Render từng session (bữa ăn) */}
                    {sessions.map((session, sessionIndex) => {
                      const ingredients = session.ingredients ?? [];

                      return (
                        <div
                          key={sessionIndex}
                          style={{
                            padding: '20px',
                            border: '1px solid var(--border)',
                            borderRadius: 12,
                            backgroundColor: 'var(--bg-secondary)',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                          }}
                        >
                          <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
                            <Form.Item
                              name={['menus', menuIndex, 'sessions', sessionIndex, 'sessionName']}
                              rules={[{ required: true, message: 'Vui lòng nhập tên bữa ăn' }]}
                              style={{ marginBottom: 0, flex: 1, marginRight: 12 }}
                            >
                              <Input
                                placeholder="Nhập tên bữa ăn (ví dụ: Bữa sáng, Bữa trưa...)"
                                style={{ 
                                  fontSize: 16, 
                                  fontWeight: 600,
                                  border: 'none',
                                  borderBottom: '2px solid var(--border)',
                                  borderRadius: 0,
                                  padding: '4px 0',
                                  backgroundColor: 'transparent',
                                }}
                                onFocus={(e) => {
                                  e.target.style.borderBottomColor = 'var(--primary)';
                                }}
                                onBlur={(e) => {
                                  e.target.style.borderBottomColor = 'var(--border)';
                                }}
                              />
                          </Form.Item>
                            <Flex gap={8} align="center">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleAddIngredient(menuIndex, sessionIndex)}
                                style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: 6,
                                  border: '1px dashed var(--border)',
                                }}
                              >
                                <Icon name="mdi:plus-circle" size={16} />
                                Thêm nguyên liệu
                              </Button>
                              {sessions.length > 1 && (
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => handleRemoveSession(menuIndex, sessionIndex)}
                                  style={{ 
                                    color: 'var(--error)',
                                    borderColor: 'var(--error)',
                                  }}
                                >
                                  <Icon name="mdi:delete-outline" size={16} />
                                </Button>
                              )}
                            </Flex>
                          </Flex>

                          {/* Empty state cho ingredients: Hiển thị khi session chưa có nguyên liệu */}
                          {!ingredients.length ? (
                            <div style={{ 
                              padding: 20, 
                              color: 'var(--text-secondary)', 
                              textAlign: 'center',
                              border: '1px dashed var(--border)',
                              borderRadius: 8,
                              backgroundColor: 'var(--bg)',
                            }}>
                              <div style={{ marginBottom: 8, opacity: 0.5 }}>
                                <Icon name="mdi:food" size={24} />
                              </div>
                              <p style={{ margin: '0 0 12px' }}>Bữa này chưa có nguyên liệu nào.</p>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleAddIngredient(menuIndex, sessionIndex)}
                                style={{ border: '1px dashed var(--border)' }}
                              >
                                <Flex gap={4} align="center">
                                  <Icon name="mdi:plus" size={16} />
                                  <span>Thêm nguyên liệu đầu tiên</span>
                                </Flex>
                              </Button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                              {/* Render từng nguyên liệu với form fields để chỉnh sửa */}
                              {ingredients.map((ingredient: FormIngredientValue, ingredientIndex: number) => {
                                /**
                                 * Lấy foodId hiện tại:
                                 * - Ưu tiên từ watchedMenus (form state real-time)
                                 * - Nếu không có, dùng từ ingredient (initial value)
                                 */
                                return (
                                  <div
                                    key={ingredientIndex}
                                    style={{
                                      display: 'grid',
                                      gridTemplateColumns: '2fr repeat(5, 1fr) auto',
                                      gap: 12,
                                      alignItems: 'flex-end',
                                      padding: '16px',
                                      border: '1px solid var(--border)',
                                      borderRadius: 8,
                                      backgroundColor: 'var(--bg)',
                                      position: 'relative',
                                      transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.borderColor = 'var(--primary)';
                                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.borderColor = 'var(--border)';
                                      e.currentTarget.style.boxShadow = 'none';
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
                                          if (selectedOption?.food) {
                                            const food = selectedOption.food;
                                            const currentWeight = form.getFieldValue(['menus', menuIndex, 'sessions', sessionIndex, 'ingredients', ingredientIndex, 'weight'] as any) || food.baseWeight || 100;
                                            const nutrition = calculateNutrition(food, currentWeight);
                                            
                                            form.setFieldsValue({
                                              menus: form.getFieldValue('menus')?.map((m: FormMenuValue, mi: number) => {
                                                if (mi !== menuIndex) return m;
                                                return {
                                                  ...m,
                                                  sessions: (m.sessions || []).map((s: FormSessionValue, si: number) => {
                                                    if (si !== sessionIndex) return s;
                                                    return {
                                                      ...s,
                                                      ingredients: (s.ingredients || []).map((ing: FormIngredientValue, ii: number) => {
                                                        if (ii !== ingredientIndex) return ing;
                                                        return {
                                                          ...ing,
                                                          foodId: value,
                                                          name: food.name,
                                                          ...nutrition,
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
                                        const currentFoodId = form.getFieldValue(['menus', menuIndex, 'sessions', sessionIndex, 'ingredients', ingredientIndex, 'foodId'] as any);
                                        if (currentFoodId && value) {
                                          const selectedOption = ingredientOptions.find((opt: any) => opt.value === currentFoodId);
                                          if (selectedOption?.food) {
                                            const nutrition = calculateNutrition(selectedOption.food, Number(value));
                                            form.setFieldsValue({
                                              [`menus.${menuIndex}.sessions.${sessionIndex}.ingredients.${ingredientIndex}.calories`]: nutrition.calories,
                                              [`menus.${menuIndex}.sessions.${sessionIndex}.ingredients.${ingredientIndex}.carbs`]: nutrition.carbs,
                                              [`menus.${menuIndex}.sessions.${sessionIndex}.ingredients.${ingredientIndex}.protein`]: nutrition.protein,
                                              [`menus.${menuIndex}.sessions.${sessionIndex}.ingredients.${ingredientIndex}.fat`]: nutrition.fat,
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
                                  
                                  {/* Button xóa nguyên liệu */}
                                  <Form.Item style={{ marginBottom: 0 }}>
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={() => handleRemoveIngredient(menuIndex, sessionIndex, ingredientIndex)}
                                      style={{ 
                                        color: 'var(--error)',
                                        borderColor: 'var(--error)',
                                        minWidth: 'auto',
                                        padding: '4px 8px',
                                      }}
                                      title="Xóa nguyên liệu"
                                    >
                                      <Icon name="mdi:delete-outline" size={18} />
                                    </Button>
                                  </Form.Item>
                                </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    
                    {/* Button thêm bữa ăn ở cuối danh sách */}
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => handleAddSession(menuIndex)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: 8,
                        border: '1px dashed var(--border)',
                        padding: '16px',
                        width: '100%',
                      }}
                    >
                      <Icon name="mdi:plus-circle" size={20} />
                      Thêm bữa ăn mới
                    </Button>
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

