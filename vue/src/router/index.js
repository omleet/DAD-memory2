import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeComponent from '@/components/HomeComponent.vue'
import WebSocketTester from '@/components/WebSocket/WebSocketTester.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'
import SinglePlayerGame from '@/components/GameMode/SinglePlayerGame.vue'
import MultiplayerGame from '@/components/GameMode/MultiplayerGame.vue'
import CardGame from '@/components/CardGame/CardGame.vue'
import CardGame4x4 from '@/components/CardGame/CardGame4x4.vue'
import CardGame6x6 from '@/components/CardGame/CardGame6x6.vue'
import Profile from '@/components/User/Profile.vue'
import LeaderboardsAll from '@/components/Boards/LeaderboardsAll.vue'
import PublicLeaderboardsByTime from '@/components/Boards/PublicLeaderboardsByTime.vue'
import PublicLeaderboardsByMoves from '@/components/Boards/PublicLeaderboardsByMoves.vue'
import PublicLeaderboardMultiplayer from '@/components/Boards/PublicLeaderboardMultiplayer.vue'
import  PurchaseBraincoins from '@/components/Purchases/PurchaseBraincoins.vue'
import ProfileEdit from '@/components/User/ProfileEdit.vue'
import AccountDelete from '@/components/User/AccountDelete.vue'
import TransactionListUser from '@/components/Transactions/TransactionListUser.vue'
import GameHistory from '@/components/GameHistory/GameHistory.vue'
import AdminTab from '@/components/Admin/AdminTab.vue'
import CreateAccountAdmin from '@/components/Admin/CreateAccountAdmin.vue'
import UserLists from '@/components/Admin/UserLists.vue'
import GeneralStatistics from '@/components/Statistics/GeneralStatistics.vue'
import MyStatistics from '@/components/Statistics/MyStatistics.vue'
import AdminStatistics from '@/components/Statistics/AdminStatistics.vue'
import PrivateScoreBoard  from '@/components/Boards/PrivateScoreboard.vue'
import UnavailablePage from '@/components/Unavailable/UnavailablePage.vue'
import { useSpGameStore } from '@/stores/spgame';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeComponent
    },
    {
      path: '/loginform',
      name: 'loginform',
      component: LoginForm
    },
    {
      path: '/websocket',
      name: 'websocket',
      component: WebSocketTester
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterForm
    },
    {
      path: '/cardgame',
      name: 'cardgame',
      component: CardGame
    },
    {
      path: '/singleplayer',
      name: 'singleplayer',
      component: SinglePlayerGame
    },
    {
      path: '/multiplayer',
      name: 'multiplayer',
      component: MultiplayerGame
    },
    {
      path: '/cardgame4x4',
      name: 'cardgame4x4',
      component: CardGame4x4
    },
    {
      path: '/cardgame6x6',
      name: 'cardgame6x6',
      component: CardGame6x6
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      
    },
    {
      path: '/leaderboardsall',
      name: 'leaderboardsall',
      component: LeaderboardsAll,
    },
    {
      path: '/publicleaderboardsbytime',
      name: 'publicleaderboardsbytime',
      component: PublicLeaderboardsByTime,
    },
    {
      path: '/publicleaderboardsbymoves',
      name: 'publicleaderboardsbymoves',
      component: PublicLeaderboardsByMoves,
    },
    {
      path: '/publicleaderboardsmultiplayer',
      name: 'publicleaderboardsmultiplayer',
      component: PublicLeaderboardMultiplayer,
    },
    {
      path: '/profileedit',
      name: 'profileedit',
      component: ProfileEdit,
    },
    {
      path: '/accountdelete',
      name: 'accountdelete',
      component: AccountDelete,
    },
    {
      path: '/purchasebraincoins',
      name: 'purchasebraincoins',
      component: PurchaseBraincoins,
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: TransactionListUser,
    },
    {
      path: '/gamehistory',
      name: 'gamehistory',
      component: GameHistory,
    },
    {
      path: '/admintab',
      name: 'admintab',
      component: AdminTab,
    },
    {
      path: '/createaccountadmin',
      name: 'createaccountadmin',
      component: CreateAccountAdmin,
    },
    {
      path: '/userlists',
      name: 'userlists',
      component: UserLists,
    },
    
    {
      path: '/generalstatistics',
      name: 'generalstatistics',
      component: GeneralStatistics,
    },
    {
      path: '/mystatistics',
      name: 'mystatistics',
      component: MyStatistics,
    },
    {
      path: '/adminstatistics',
      name: 'adminstatisticss',
      component: AdminStatistics,
    },
    {
      path: '/personal-score',
      name: 'personal-score',
      component: PrivateScoreBoard,
    },
    {
      path: '/unavailablepage',
      name: 'unavailablepage',
      component: UnavailablePage,
    },
   
    
  ]
})

let handlingFirstRoute = true

router.beforeEach(async (to, from, next) => {
  const spGameStore = useSpGameStore();
  const storeAuth = useAuthStore()
  
  if (handlingFirstRoute) {
      handlingFirstRoute = false
      await storeAuth.restoreToken()
  }

  if ((to.name == "profile" | to.name == "cardgame4x4" | to.name == "cardgame6x6" | to.name == "multiplayer" | to.name == "accountdelete" | to.name == "profileedit" | to.name == "mystatistics" | to.name == "purchasebraincoins"
    | to.name == "transactions" | to.name == "gamehistory" | to.name=="personal-score" | to.name == "unavailablepage") && (!storeAuth.user)) {
    next({ name: 'loginform' })
    return
  }

  if ((to.name == "accountdelete" ) && (storeAuth.isAdministrator())) {
    next({ name: 'home' })
    return
  }

  if ((to.name == "admintab" | to.name == "createaccountadmin" | to.name == "userlists" | to.name == "adminstatistics") && (!storeAuth.isAdministrator())) {
    next({ name: 'home' })
    return
  }
  
  if (['cardgame4x4', 'cardgame6x6'].includes(to.name)) {
    const userBalance = storeAuth.user?.brain_coins_balance || 0; 
    if (userBalance < 0) {
      next({ name: 'singleplayer' })
      return ; 
    }
    if (!spGameStore.canProceedToGame) {
      next({ name: 'singleplayer' });
      return;
    }
  }
  next()
  
})


export default router
