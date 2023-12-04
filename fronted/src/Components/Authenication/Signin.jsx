import { Button } from '@chakra-ui/react';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { VStack } from '@chakra-ui/layout';
import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { LoginUser } from '../../service/api';
import { useNavigate } from 'react-router-dom';
import { ChatProvider } from '../../Context/ContextProvider';

const Signin = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  const Navigate = useNavigate();

  const { setAccount } = ChatProvider();

  const submitHandler = async () => {
    setLoading(true);

    if (!email || !password) {
      toast({
        title: 'Please Fill all the Feilds',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }

    try {
      const User = {
        email: email,
        password: password,
      };

      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      const user = await LoginUser(User, config);

      // console.log(user);

      if (user.status === 200) {
        toast({
          title: 'Login Successfully',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'bottom',
        });

        setAccount(user.data);

        localStorage.setItem('userInfo', JSON.stringify(user.data));
        Navigate('/chats');
        return;
      }

      toast({
        title: 'Error Occured!',
        description: user.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: error.response,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing='10px'>
      <FormControl id='email' isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          value={email}
          type='email'
          placeholder='Enter Your Email Address'
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size='md'>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={show ? 'text' : 'password'}
            placeholder='Enter password'
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme='blue'
        width='100%'
        style={{ marginTop: 15 }}
        isLoading={loading}
        onClick={submitHandler}
      >
        Login
      </Button>
      <Button
        variant='solid'
        colorScheme='red'
        width='100%'
        onClick={() => {
          setEmail('guest@example.com');
          setPassword('123456');
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Signin;
