import React,{FC, useContext, useEffect, useState} from 'react';
import { Context } from './index';
import LoginForm from './components/LoginForm';
import { observer } from 'mobx-react-lite';
import { IUser } from './models/IUser';
import UserService from './services/UserService';


const App: FC = () => {
  
  const {store} = useContext(Context)
  const [users,setUsers] = useState<IUser[]>([]);
  useEffect(() =>{
    if(localStorage.getItem("token")){
      store.checkAuth()
    }
  },[])

  async function getUsers(){
    try {
      const response = await UserService.featchUsers();
      setUsers(response.data);
    } catch (error) {
      console.log(error)
    }
  }

  if(store.isLoading){
    return(
      <div>
        Loading
      </div>
    )
  }

  if(!store.isAuth){
    return(
      <LoginForm/>
      
    )
  }
  return (
    <div>
      <h1>{store.isAuth ? `user is here ${store.user.email}`:"Please Login"}</h1>
      <h1>{store.user.isActivated ? "your acc activated !!!":"Activate your acc"}</h1>
      <button onClick={() => store.logout()}>Logout</button>
      <div>
        <button onClick={() => getUsers()}>get Users</button>
      </div>
      {users.map( user =>
        <div key={user.email}>{user.email}</div>
        )
      }
    </div>
  );
}

export default observer(App);
