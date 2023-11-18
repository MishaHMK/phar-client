import { createStore, createHook, Action } from 'react-sweet-state';

type State = { IsEditShown: any, productToEditId: any, IsCreateShown: any, cartCount: any, currentUserId: any};
type Actions = typeof actions;


const initialState: State = {
    IsEditShown: false,
    IsCreateShown: false,
    productToEditId: 0,
    cartCount: 0,
    currentUserId: ' '
};

const actions = {
    makeEditProductModalVisible: (): Action<State> => 
    async ({ setState }) => 
    {
      setState({
        IsEditShown: true
      });
    },
  
    makeEditProductModalInvisible: (): Action<State> => 
    async ({ setState }) => 
    {
      setState({
        IsEditShown: false
      });
    },

    makeCreateProductModalVisible: (): Action<State> => 
    async ({ setState }) => 
    {
      setState({
        IsCreateShown: true
      });
    },
  
    makeCreateProductModalInvisible: (): Action<State> => 
    async ({ setState }) => 
    {
      setState({
        IsCreateShown: false
      });
    },

    addToCart: (count: any): Action<State> => 
    async ({ setState }) => {
        setState({ cartCount: count });
      },
    
};

const Store = createStore<State, Actions>({
    initialState,
    actions
  });
  
export const useUserStore = createHook(Store);