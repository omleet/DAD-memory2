import { createRouter, createWebHistory } from 'vue-router'
import HomeComponent from '@/components/HomeComponent.vue'
import WebSocketTester from '@/components/WebSocketTester.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import ForgottenPasswordForm from '@/components/auth/ForgottenPasswordForm.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'
import SinglePlayerGame from '@/components/SinglePlayerGame.vue'
import MultiplayerGame from '@/components/MultiplayerGame.vue'
import CardGame from '@/components/CardGame.vue'
import CardGame4x4 from '@/components/CardGame4x4.vue'
import CardGame6x6 from '@/components/CardGame6x6.vue'
import LaravelTester from '@/components/LaravelTester.vue'
import Profile from '@/components/Profile.vue'
import LeaderboardsAll from '@/components/LeaderboardsAll.vue'
import PublicLeaderboardsByTime from '@/components/PublicLeaderboardsByTime.vue'
import PublicLeaderboardsByMoves from '@/components/PublicLeaderboardsByMoves.vue'
import PublicLeaderboardMultiplayer from '@/components/PublicLeaderboardMultiplayer.vue'



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
      path: '/passwordrecovery',
      name: 'passwordrecovery',
      component: ForgottenPasswordForm
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
      path: '/laraveltester',
      name: 'laraveltester',
      component: LaravelTester
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

    
  ]
})

export default router