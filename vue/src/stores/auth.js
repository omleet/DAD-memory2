import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useErrorStore } from '@/stores/error'
import avatarNoneAssetURL from '@/assets/avatar-none.png'
import { useRouter } from 'vue-router'
import { useToast } from '@/components/ui/toast/use-toast'



export const useAuthStore = defineStore('auth', () => {

  const storeError = useErrorStore()
  const router = useRouter()
  const { toast } = useToast()

  // Estado
  const user = ref(null)
  const token = ref('')

  // Computed Properties
  const userName = computed(() => {
    return user.value ? user.value.name : ''
  })

  const userFirstLastName = computed(() => {
    const names = userName.value.trim().split(' ')
    const firstName = names[0] ?? ''
    const lastName = names.length > 1 ? names[names.length - 1] : ''
    return (firstName + ' ' + lastName).trim()
  })

  const userEmail = computed(() => {
    return user.value ? user.value.email : ''
  })

  const nickname = computed(() => {
    return user.value ? user.value.nickname : ''
  })

  const userType = computed(() => {
    return user.value ? user.value.type : ''
  })

  const userPhotoUrl = computed(() => {
    const photoFile = user.value ? user.value.photo_filename ?? '' : ''
    if (photoFile) {
      return axios.defaults.baseURL.replaceAll("/api", photoFile)
    }
    return avatarNoneAssetURL
  })

  const balance = computed(() => {
    return user.value ? user.value.brain_coins_balance : 0
  })

  const gamesWon = computed(() => {
    return user.value ? user.value.games_won : 0
  })

  // Funções Privadas
  const clearUser = () => {
    resetIntervalToRefreshToken()
    user.value = null
    token.value = ''
    localStorage.removeItem('token')
    axios.defaults.headers.common.Authorization = ''
    //router.push('/profile') // Redireciona para a página de login
  }

  let intervalToRefreshToken = null

  const resetIntervalToRefreshToken = () => {
    if (intervalToRefreshToken) {
      clearInterval(intervalToRefreshToken)
    }
    intervalToRefreshToken = null
  }

  const repeatRefreshToken = () => {
    if (intervalToRefreshToken) {
      clearInterval(intervalToRefreshToken)
    }
    intervalToRefreshToken = setInterval(async () => {
      try {
        const response = await axios.post('auth/refreshtoken')
        token.value = response.data.token
        localStorage.setItem('token', token.value)
        axios.defaults.headers.common.Authorization = 'Bearer ' + token.value
        return true
      } catch (e) {
        clearUser()
        storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Authentication Error!')
        return false
      }
    }, 1000 * 60 * 110)  // repeat every 110 minutes
    return intervalToRefreshToken
  }

  const restoreToken = async function () {
    let storedToken = localStorage.getItem('token')
    if (storedToken) {
      try {
        token.value = storedToken
        axios.defaults.headers.common.Authorization = 'Bearer ' + token.value
        const responseUser = await axios.get('users/me')
        user.value = responseUser.data.data
        repeatRefreshToken()
        return true
      } catch {
        clearUser()
        return false
      }
    }
    return false
  }

  // Funções Públicas
  const login = async (credentials) => {
    storeError.resetMessages()
    try {
      const responseLogin = await axios.post('auth/login', credentials)
      token.value = responseLogin.data.token
      localStorage.setItem('token', token.value)
      axios.defaults.headers.common.Authorization = 'Bearer ' + token.value
      const responseUser = await axios.get('users/me')
      user.value = responseUser.data.data
      repeatRefreshToken()
      router.push('/profile')
      return user.value
    } catch (e) {
      clearUser()
      storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Authentication Error!')
      return false
    }
  }

  const logout = async () => {
    storeError.resetMessages()
    try {
      await axios.post('auth/logout')
      router.push('/')
      clearUser()
      return true
    } catch (e) {
      clearUser()
      storeError.setErrorMessages(e.response.data.message, [], e.response.status, 'Authentication Error!')
      return false
    }
  }

  const ProfileUpdate = async (credentials) => {
    const payload = {}

    if (credentials.email) {
      payload.email = credentials.email
    }
    if (credentials.name) {
      payload.name = credentials.name
    }
    if (credentials.nickname) {
      payload.nickname = credentials.nickname
    }
    if (credentials.password) {
      payload.password = credentials.password
    }
    if (credentials.photo_filename) {
      payload.photo_filename = credentials.photo_filename
    }

    console.log(payload);
    try {
      const response = await axios.put(`/users/${user.value.id}`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      console.log(response.data);
      await getDataAfterTheUpdate();

      router.push('/profile');

      toast({
        description: 'Account info has been updated successfully!',
      })


      return response.data
    } catch (e) {
      console.log(e);
      if (e.response) {
        storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Profile Update Error!')
      } else {
        storeError.setErrorMessages('An unexpected error occurred.')
      }
      return false
    }
  }

  const getDataAfterTheUpdate = async () => {
    try {
      const response = await axios.get('users/me')
      user.value = response.data.data
      
      return user.value
    } catch (e) {
      clearUser()
      storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Authentication Error!')
      return false

    }
  }

  const canUserDeleteOwnAccount = () => {
    return user.value && userType.value === 'P'
  }

  const isAdministrator = () => {
    return user.value && userType.value === 'A'
  }

  const validatePassword = async (password) => {
    storeError.resetMessages()
    try {
      const response = await axios.post('auth/validatepassword', { password })
      return response.data
    } catch (e) {
      storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'The current password is incorrect')
      return false
    }
  }

  const accountRemoval = async () => {
    storeError.resetMessages()
    try {
      await axios.delete(`users/${user.value.id}`)
      toast(
        {
          description: 'Account has been deleted successfully!',
        })
      clearUser()
      return true
    } catch (e) {
      clearUser()
      storeError.setErrorMessages(e.response.data.message, [], e.response.status, 'Error in Authentication!')
      return false
    }
  }

  /*const register = async (credentials) => {
    const payload = {
      email: credentials.email,
      password: credentials.password,
      name: credentials.name,
      nickname: credentials.nickname,
      type: credentials.type,
      photo_filename: credentials.photo_filename // Base64 encoded image
    }

    try {
      const response = await axios.post('/users', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (credentials.type === 'P') {
        router.push('/loginform')
      }
      toast({
        description: 'User has been created correctly!',
      })
      return response.data
    } catch (e) {
      if (e.response) {
        storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Signup Error!')
      } else {
        console.log(e)
        storeError.setErrorMessages('An unexpected error occurred.')
      }
      return false
    }
  }*/

    const register = async (credentials) => {
      const { email, password, name, nickname, type, photo_filename } = credentials;
    
      const payload = {
        email,
        password,
        name,
        nickname,
        type,
        photo_filename, // Base64 encoded image
      };
    
      try {
        // Envia a requisição para criar o usuário
        const response = await axios.post('/users', payload, {
          headers: { 'Content-Type': 'application/json' },
        });
    
        // Redireciona para a página de login se o tipo for "P"
        if (type === 'P') {
          router.push('/loginform');
        }
    
        // Exibe a mensagem de sucesso
        toast({ description: 'User has been created correctly!' });
    
        // Retorna os dados da resposta
        return response.data;
    
      } catch (e) {
        // Verifica se a resposta do servidor contém erros detalhados
        if (e.response) {
          const { data, status } = e.response;
          storeError.setErrorMessages(
            data.message || 'An error occurred during registration.',
            data.errors || [],
            status,
            'Signup Error!'
          );
        } else {
          console.error(e);
          storeError.setErrorMessages('An unexpected error occurred.');
        }
    
        // Retorna false em caso de erro
        return false;
      }
    };
    


  return {
    user,
    userName,
    userFirstLastName,
    userEmail,
    userType,
    userPhotoUrl,
    nickname,
    balance,
    gamesWon,
    login,
    logout,
    restoreToken,
    ProfileUpdate,
    canUserDeleteOwnAccount,
    isAdministrator,
    validatePassword,
    accountRemoval,
    register
  }
})
