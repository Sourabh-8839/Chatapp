import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://chatapp-j7en.onrender.com/chatapp',

  // baseURL: 'https://chatapp-jmne.onrender.com',
});

export const addUser = async (data) => {
  try {
    return await axiosInstance.post('/user/Signup', data);
  } catch (error) {
    console.log('Error while Calling AddUserApi ', error.message);
  }
};

export const LoginUser = async (form, config) => {
  try {
    let data = await axiosInstance.post('/user/Signin', form, config);

    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const GetUser = async (config) => {
  try {
    const user = await axiosInstance.get('/getUser', config);
    return user.data;
  } catch (error) {}
};

export const setConversation = async (user, config) => {
  try {
    const { data } = await axiosInstance.post('/chat/set', user, config);

    return data;
  } catch (error) {
    console.log('Error while Calling setConversation Api ', error.message);
  }
};

export const getConversation = async (config) => {
  try {
    const { data } = await axiosInstance.get('/chat/get', config);

    return data;
  } catch (error) {
    console.log('Error while Calling getConversation Api ', error.message);
  }
};

export const createGroup = async (Group, config) => {
  try {
    const { data } = await axiosInstance.post('/chat/setGroup', Group, config);
    return data;
  } catch (error) {
    console.log('Error while Calling createGroup Api ', error);
    return error;
  }
};

export const RenameGroup = async (updateGroup, config) => {
  try {
    const { data } = await axiosInstance.put(
      '/chat/group/rename',
      updateGroup,
      config
    );

    return data;
  } catch (error) {
    console.log('Error while Calling renameGroup  Api ', error.message);

    return error;
  }
};

export const AddUSerInGroup = async (user, config) => {
  try {
    const { data } = await axiosInstance.put(
      '/chat/group/addUser',
      user,
      config
    );

    // console.log(data);
    return data;
  } catch (error) {
    console.log('Error while Calling addUSer Api ', error.message);

    return error;
  }
};

export const RemoveUSerInGroup = async (user, config) => {
  try {
    const { data } = await axiosInstance.put(
      '/chat/group/remove',
      user,
      config
    );

    // console.log(data);
    return data;
  } catch (error) {
    console.log('Error while Calling removeUSer Api ', error.message);

    return error;
  }
};

export const SendMessage = async (message, config) => {
  try {
    const { data } = await axiosInstance.post('/message/send', message, config);
    // console.log(data);
    return data;
  } catch (error) {
    console.log('Error while Calling sendMeassage Api ', error.message);

    return error;
  }
};

export const fetchAllMessages = async (chatId, config) => {
  try {
    const { data } = await axiosInstance.get(`message/get/${chatId}`, config);
    // console.log(data);
    return data;
  } catch (error) {
    console.log('Error while Calling getMeassage Api ', error.message);

    return error;
  }
};
