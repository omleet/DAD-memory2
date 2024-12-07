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
    ProfileUpdate
  }
})
