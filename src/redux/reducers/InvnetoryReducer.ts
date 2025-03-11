import { InventoryActionTypes, InventoryState, FETCH_INVENTORY_SUCCESS, UPDATE_INVENTORY_SUCCESS, TRANSFER_INVENTORY_SUCCESS } from '../constants/inventoryConstants';

const initialState: InventoryState = {
  inventory: [],
  loading: false,
  error: null,
};

export const inventoryReducer = (state = initialState, action: InventoryActionTypes): InventoryState => {
  switch (action.type) {
    case FETCH_INVENTORY_SUCCESS:
      return { ...state, inventory: action.payload, loading: false, error: null };

    case UPDATE_INVENTORY_SUCCESS:
      return {
        ...state,
        inventory: state.inventory.map((item:any) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };

    case TRANSFER_INVENTORY_SUCCESS:
      return {
        ...state,
        inventory: state.inventory.map((item:any) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };

    default:
      return state;
  }
};

