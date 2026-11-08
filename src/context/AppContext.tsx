import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CurrencyCode,
  CURRENCIES,
  UserRole,
  Room,
  Squad,
  Transaction,
  SubscriptionTier,
  Tournament,
  CommunityPost,
  PlayerBadge,
  WithdrawalRequest,
  SupportTicket,
  MatchBracketNode,
  GameTitle,
  Guild,
  GuildMember,
  GuildRole,
  TournamentGroup,
  PlatformLimitsSettings,
  getGroupNameFromIndex,
} from '../types';
import {
  INITIAL_ROOMS,
  INITIAL_SQUADS,
  INITIAL_TRANSACTIONS,
  SUBSCRIPTION_TIERS,
  INITIAL_TOURNAMENTS,
  INITIAL_COMMUNITY_POSTS,
  INITIAL_PLAYER_BADGES,
  INITIAL_WITHDRAWALS,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_BRACKET_NODES,
  INITIAL_GUILDS,
  INITIAL_PLATFORM_SETTINGS,
  INITIAL_TOURNAMENT_GROUPS,
} from '../data/mockData';
import { LanguageCode, TRANSLATIONS, LANGUAGES } from '../i18n/translations';

export type ActiveTab = 'home' | 'tournaments' | 'teams' | 'guilds' | 'wallet' | 'community' | 'leaderboard' | 'profile' | 'admin';

interface ToastNotice {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
}

interface PlayerStats {
  hoursPlayed: number;
  tournamentsParticipated: number;
  top1Victories: number;
  totalKills: number;
  kdRatio: number;
  headshotRate: number;
  level: number;
  rankTitle: string;
}

interface AppContextType {
  // Navigation & Role
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;

  // Language & Dual-Theme
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Currencies & Balance
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  balanceFcfa: number;
  pendingBalanceFcfa: number;
  formatCurrency: (amountFcfa: number, overrideCurrency?: CurrencyCode) => string;
  convertFromFcfa: (amountFcfa: number, targetCurrency?: CurrencyCode) => number;
  topUpBalance: (amountFcfa: number, providerName: string) => void;
  deductBalance: (amountFcfa: number, description: string) => boolean;

  // P2P Transfers & Withdrawals
  sendP2PTransfer: (recipientId: string, amountFcfa: number, note?: string) => boolean;
  withdrawals: WithdrawalRequest[];
  requestWithdrawal: (amountFcfa: number, method: 'mobile_money' | 'bank', accountDetails: string) => boolean;
  approveWithdrawal: (id: string) => void;

  // Tournaments & Games (Free Fire & PUBG Mobile)
  tournaments: Tournament[];
  selectedGame: 'all' | GameTitle;
  setSelectedGame: (game: 'all' | GameTitle) => void;
  addTournament: (tournament: Omit<Tournament, 'id' | 'registeredSquads'>) => boolean;
  checkInTournament: (tournamentId: string) => void;
  bracketNodes: MatchBracketNode[];

  // Rooms & Free Fire / PUBG
  rooms: Room[];
  selectedRoom: Room | null;
  setSelectedRoom: (room: Room | null) => void;
  updateRoomStatus: (roomId: string, newStatus: Room['status']) => void;
  updateRoomCredentials: (roomId: string, gameRoomId: string, gamePassword: string) => void;

  // 100 Squads & Progressions
  squads: Squad[];
  selectedSquad: Squad | null;
  setSelectedSquad: (squad: Squad | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: 'toutes' | 'qualifiée' | 'en_course' | 'éliminée';
  setStatusFilter: (f: 'toutes' | 'qualifiée' | 'en_course' | 'éliminée') => void;
  poolFilter: 'toutes' | 'Pool A' | 'Pool B' | 'Pool C' | 'Pool D';
  setPoolFilter: (p: 'toutes' | 'Pool A' | 'Pool B' | 'Pool C' | 'Pool D') => void;
  updateSquadScore: (squadId: string, killsDelta: number, placementDelta: number) => void;

  // User Squad
  userSquad: Squad;
  updateUserSquadName: (name: string, tag: string) => void;

  // Community
  communityPosts: CommunityPost[];
  addCommunityPost: (content: string, badge?: string) => void;
  likeCommunityPost: (id: string) => void;
  unreadCommunityCount: number;

  // Profile, Badges, Referral, Support
  playerBadges: PlayerBadge[];
  playerStats: PlayerStats;
  referralCode: string;
  referralCount: number;
  referralEarningsFcfa: number;
  supportTickets: SupportTicket[];
  createSupportTicket: (category: SupportTicket['category'], subject: string, message: string) => void;

  // Payments & Subscriptions
  transactions: Transaction[];
  activeSubscriptionId: string;
  subscribeToTier: (tierId: string) => boolean;
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  paymentModalDetails: { amountFcfa: number; title: string; actionType: 'topup' | 'sub' | 'tournament' } | null;
  openPaymentModal: (amountFcfa: number, title: string, actionType: 'topup' | 'sub' | 'tournament') => void;

  // Modals & UI
  isDocsModalOpen: boolean;
  setIsDocsModalOpen: (open: boolean) => void;
  isCreateTournamentModalOpen: boolean;
  setIsCreateTournamentModalOpen: (open: boolean) => void;
  isP2PModalOpen: boolean;
  setIsP2PModalOpen: (open: boolean) => void;
  isWithdrawModalOpen: boolean;
  setIsWithdrawModalOpen: (open: boolean) => void;
  toasts: ToastNotice[];
  addToast: (type: ToastNotice['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;

  // Flash Broadcast (Admin)
  broadcastNotice: string | null;
  setBroadcastNotice: (notice: string | null) => void;

  // Guildes Internationales
  guilds: Guild[];
  selectedGuild: Guild | null;
  setSelectedGuild: (g: Guild | null) => void;
  userGuild: Guild | null;
  userGuildRole: GuildRole | null;
  createGuild: (data: {
    name: string;
    tag: string;
    emblem: string;
    country: string;
    countryFlag: string;
    motto: string;
    description: string;
    primaryGame: GameTitle;
    secondaryGames: string[];
    isPublic: boolean;
    maxMembers: number | null;
  }) => boolean;
  applyToGuild: (guildId: string, message: string) => boolean;
  acceptGuildApplication: (guildId: string, applicationId: string) => void;
  rejectGuildApplication: (guildId: string, applicationId: string) => void;
  promoteGuildMember: (guildId: string, memberId: string, newRole: GuildRole) => void;
  kickGuildMember: (guildId: string, memberId: string) => void;
  leaveGuild: (guildId: string) => void;

  // Groupes Dynamiques
  tournamentGroups: TournamentGroup[];
  generateGroupsForTournament: (tournamentId: string, totalSquads: number, squadsPerGroup: number) => TournamentGroup[];
  moveSquadBetweenGroups: (squadId: string, fromGroupId: string, toGroupId: string) => void;
  addGroupToTournament: (tournamentId: string, name?: string) => void;
  removeGroupFromTournament: (groupId: string) => void;

  // Paramètres des Limites (Platform Limits)
  platformSettings: PlatformLimitsSettings;
  updatePlatformSettings: (newSettings: Partial<PlatformLimitsSettings>, changeNote: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [userRole, setUserRole] = useState<UserRole>('admin'); // Admin by default so the user has full control as requested!
  const [currency, setCurrency] = useState<CurrencyCode>('FCFA');
  const [language, setLanguageState] = useState<LanguageCode>('fr');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [balanceFcfa, setBalanceFcfa] = useState<number>(45000); // 45 000 FCFA initial
  const [pendingBalanceFcfa, setPendingBalanceFcfa] = useState<number>(12500); // 12 500 FCFA en attente

  const [tournaments, setTournaments] = useState<Tournament[]>(INITIAL_TOURNAMENTS);
  const [selectedGame, setSelectedGame] = useState<'all' | GameTitle>('all');
  const [bracketNodes, setBracketNodes] = useState<MatchBracketNode[]>(INITIAL_BRACKET_NODES);

  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const [squads, setSquads] = useState<Squad[]>(INITIAL_SQUADS);
  const [selectedSquad, setSelectedSquad] = useState<Squad | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'toutes' | 'qualifiée' | 'en_course' | 'éliminée'>('toutes');
  const [poolFilter, setPoolFilter] = useState<'toutes' | 'Pool A' | 'Pool B' | 'Pool C' | 'Pool D'>('toutes');

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);
  const [unreadCommunityCount, setUnreadCommunityCount] = useState<number>(213);

  const [playerBadges] = useState<PlayerBadge[]>(INITIAL_PLAYER_BADGES);
  const [playerStats] = useState<PlayerStats>({
    hoursPlayed: 54,
    tournamentsParticipated: 34,
    top1Victories: 12,
    totalKills: 284,
    kdRatio: 3.82,
    headshotRate: 64,
    level: 42,
    rankTitle: 'Grand Maître Free Fire & PUBG',
  });

  const [referralCode] = useState('ARENA-VIP-ALAN');
  const [referralCount] = useState(4);
  const [referralEarningsFcfa] = useState(20000);

  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(INITIAL_WITHDRAWALS);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS);
  const [activeSubscriptionId, setActiveSubscriptionId] = useState<string>('sub_pro');

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [paymentModalDetails, setPaymentModalDetails] = useState<{
    amountFcfa: number;
    title: string;
    actionType: 'topup' | 'sub' | 'tournament';
  } | null>(null);

  const [isCreateTournamentModalOpen, setIsCreateTournamentModalOpen] = useState<boolean>(false);
  const [isP2PModalOpen, setIsP2PModalOpen] = useState<boolean>(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState<boolean>(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState<boolean>(false);

  const [toasts, setToasts] = useState<ToastNotice[]>([
    {
      id: 'init-toast',
      type: 'info',
      title: 'ARENA ESPORT En Ligne',
      message: 'Bienvenue sur la plateforme e-sport mondiale. Mode Administrateur activé avec plein contrôle.',
      timestamp: 'À l’instant',
    },
  ]);
  const [broadcastNotice, setBroadcastNotice] = useState<string | null>(
    '⚡ TOURNOIS OFFICIELS PUBLIÉS : Free Fire Champions League S2 & PUBG Mobile Pro Masters. Seul l’administrateur publie avec gains garantis.'
  );

  // Sync theme to HTML element
  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  // Sync theme and language attributes on mount and changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    const config = LANGUAGES[language] || LANGUAGES['fr'];
    document.documentElement.setAttribute('dir', config.dir);
    document.documentElement.setAttribute('lang', language);
  }, [theme, language]);

  // Sync language and RTL
  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    const config = LANGUAGES[lang] || LANGUAGES['fr'];
    document.documentElement.setAttribute('dir', config.dir);
    document.documentElement.setAttribute('lang', lang);
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['fr']?.[key] || key;
  };

  const addToast = (type: ToastNotice['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [
      { id, type, title, message, timestamp: 'À l’instant' },
      ...prev.slice(0, 4),
    ]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Currency Helpers
  const convertFromFcfa = (amountFcfa: number, targetCurrency: CurrencyCode = currency): number => {
    const rate = CURRENCIES[targetCurrency].rateToFcfa;
    if (targetCurrency === 'FCFA') return amountFcfa;
    return amountFcfa / rate;
  };

  const formatCurrency = (amountFcfa: number, overrideCurrency?: CurrencyCode): string => {
    const curr = overrideCurrency || currency;
    const config = CURRENCIES[curr];
    const converted = convertFromFcfa(amountFcfa, curr);

    if (curr === 'FCFA') {
      return `${Math.round(converted).toLocaleString('fr-FR')} FCFA`;
    }
    if (curr === 'EUR') {
      return `${converted.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
    }
    if (curr === 'USD') {
      return `$${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (curr === 'GBP') {
      return `£${converted.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `${Math.round(converted)} ${config.symbol}`;
  };

  // Balance operations
  const topUpBalance = (amountFcfa: number, providerName: string) => {
    setBalanceFcfa((prev) => prev + amountFcfa);
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      description: `Recharge portefeuille via ${providerName}`,
      amountFcfa,
      amountFormatted: `+${amountFcfa.toLocaleString('fr-FR')} FCFA`,
      type: 'topup',
      status: 'success',
      provider: providerName,
      reference: `NX-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
    addToast('success', 'Recharge Réussie', `${amountFcfa.toLocaleString('fr-FR')} FCFA ont été crédités avec succès.`);
  };

  const deductBalance = (amountFcfa: number, description: string): boolean => {
    if (balanceFcfa < amountFcfa) {
      addToast('error', 'Solde Insuffisant', `Votre solde est de ${formatCurrency(balanceFcfa)}. Veuillez recharger via Nexus Africa Mobile Money ou Carte Bancaire.`);
      return false;
    }
    setBalanceFcfa((prev) => prev - amountFcfa);
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      description,
      amountFcfa: -amountFcfa,
      amountFormatted: `-${amountFcfa.toLocaleString('fr-FR')} FCFA`,
      type: 'tournament_entry',
      status: 'success',
      provider: 'Solde In-App',
      reference: `ARENA-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
    addToast('success', 'Opération Validée', `${description} : débit de ${formatCurrency(amountFcfa)} effectué.`);
    return true;
  };

  // P2P Atomic Transfer
  const sendP2PTransfer = (recipientId: string, amountFcfa: number, note?: string): boolean => {
    if (balanceFcfa < amountFcfa) {
      addToast('error', 'Solde Insuffisant', `Votre solde est de ${formatCurrency(balanceFcfa)}. Vous ne pouvez pas transférer plus que votre solde disponible.`);
      return false;
    }

    setBalanceFcfa((prev) => prev - amountFcfa);

    const ref = `P2P-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const newTx: Transaction = {
      id: `tx-p2p-${Date.now()}`,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      description: `Transfert P2P vers ${recipientId}${note ? ` (${note})` : ''}`,
      amountFcfa: -amountFcfa,
      amountFormatted: `-${amountFcfa.toLocaleString('fr-FR')} FCFA`,
      type: 'topup',
      status: 'success',
      provider: 'ARENA P2P Internal',
      reference: ref,
    };
    setTransactions((prev) => [newTx, ...prev]);
    addToast('success', 'Transfert P2P Confirmé', `${formatCurrency(amountFcfa)} ont été transférés instantanément au joueur ${recipientId}.`);
    return true;
  };

  // Withdrawals
  const requestWithdrawal = (amountFcfa: number, method: 'mobile_money' | 'bank', accountDetails: string): boolean => {
    if (balanceFcfa < amountFcfa) {
      addToast('error', 'Solde Insuffisant', `Votre solde est de ${formatCurrency(balanceFcfa)}.`);
      return false;
    }

    // Deduct available, put in pending
    setBalanceFcfa((prev) => prev - amountFcfa);
    setPendingBalanceFcfa((prev) => prev + amountFcfa);

    const newReq: WithdrawalRequest = {
      id: `wth-${Date.now()}`,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      amountFcfa,
      method,
      accountDetails,
      status: 'pending',
      reference: `NX-WTH-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    };

    setWithdrawals((prev) => [newReq, ...prev]);
    addToast('success', 'Demande de Retrait Enregistrée', `Votre demande de retrait de ${formatCurrency(amountFcfa)} vers ${accountDetails} est soumise à vérification.`);
    return true;
  };

  const approveWithdrawal = (id: string) => {
    setWithdrawals((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          setPendingBalanceFcfa((p) => Math.max(0, p - w.amountFcfa));
          return { ...w, status: 'completed' };
        }
        return w;
      })
    );
    addToast('success', 'Retrait Validé', `Le décaissement Nexus Africa a été exécuté.`);
  };

  // Support Tickets
  const createSupportTicket = (category: SupportTicket['category'], subject: string, message: string) => {
    const newTicket: SupportTicket = {
      id: `t-${Date.now()}`,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
      category,
      subject,
      message,
      status: 'open',
    };
    setSupportTickets((prev) => [newTicket, ...prev]);
    addToast('success', 'Ticket Envoyé', 'Votre demande a été transmise à l\'équipe d\'assistance ARENA ESPORT.');
  };

  // Check-in
  const checkInTournament = (tournamentId: string) => {
    setTournaments((prev) =>
      prev.map((t) => (t.id === tournamentId ? { ...t, checkInOpen: true } : t))
    );
    addToast('success', 'Check-in Confirmé !', 'Votre présence est validée. Préparez-vous à recevoir les clés de salle.');
  };

  const openPaymentModal = (amountFcfa: number, title: string, actionType: 'topup' | 'sub' | 'tournament') => {
    setPaymentModalDetails({ amountFcfa, title, actionType });
    setIsPaymentModalOpen(true);
  };

  const subscribeToTier = (tierId: string): boolean => {
    const tier = SUBSCRIPTION_TIERS.find((t) => t.id === tierId);
    if (!tier) return false;

    if (tier.priceFcfaMonthly > 0) {
      const success = deductBalance(tier.priceFcfaMonthly, `Abonnement Pass : ${tier.name}`);
      if (!success) {
        openPaymentModal(tier.priceFcfaMonthly, `Activation ${tier.name}`, 'sub');
        return false;
      }
    }
    setActiveSubscriptionId(tierId);
    addToast('success', 'Pass Activé !', `Vous bénéficiez maintenant des avantages du pass ${tier.name}.`);
    return true;
  };

  // Tournament creation
  const addTournament = (tournamentData: Omit<Tournament, 'id' | 'registeredSquads'>): boolean => {
    if (tournamentData.isOfficial || tournamentData.cashprizeFcfa > 0) {
      if (userRole !== 'admin') {
        addToast('error', 'Accès Refusé', 'Seul le Super Administrateur a le droit de publier des tournois officiels avec récompenses financières.');
        return false;
      }
    }

    const newTourn: Tournament = {
      ...tournamentData,
      id: `tourn-${Date.now()}`,
      registeredSquads: 1,
    };

    setTournaments((prev) => [newTourn, ...prev]);
    addToast('success', 'Tournoi Publié !', `${newTourn.title} est maintenant accessible.`);
    return true;
  };

  // Community methods
  const addCommunityPost = (content: string, badge?: string) => {
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      author: userRole === 'admin' ? 'ADMINISTRATION ARENA' : userSquad.captainName,
      authorRole: userRole,
      squadTag: userSquad.tag,
      flag: userSquad.flag,
      timeAgo: 'À l’instant',
      content,
      likes: 1,
      hasLiked: true,
      repliesCount: 0,
      badge,
    };
    setCommunityPosts((prev) => [newPost, ...prev]);
    addToast('success', 'Message Publié', 'Votre message a été partagé avec la communauté.');
  };

  const likeCommunityPost = (id: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const hasLiked = !p.hasLiked;
          return {
            ...p,
            hasLiked,
            likes: hasLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  // Rooms Management
  const updateRoomStatus = (roomId: string, newStatus: Room['status']) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === roomId) {
          return {
            ...r,
            status: newStatus,
            scheduledTime: newStatus === 'live' ? 'En Direct' : newStatus === 'completed' ? 'Match Terminé' : 'En Attente',
          };
        }
        return r;
      })
    );
    addToast('info', 'Mise à jour Room', `Statut de la room actualisé : ${newStatus.toUpperCase()}`);
  };

  const updateRoomCredentials = (roomId: string, gameRoomId: string, gamePassword: string) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, gameRoomId, gamePassword } : r))
    );
    addToast('success', 'Identifiants Mis à Jour', `Nouveaux identifiants Free Fire sécurisés déployés pour la room.`);
  };

  // 100 Squads logic
  const updateSquadScore = (squadId: string, killsDelta: number, placementDelta: number) => {
    setSquads((prev) => {
      const updated = prev.map((s) => {
        if (s.id === squadId) {
          const totalKills = Math.max(0, s.totalKills + killsDelta);
          const placementPoints = Math.max(0, s.placementPoints + placementDelta);
          return {
            ...s,
            totalKills,
            placementPoints,
            totalScore: totalKills + placementPoints,
            matchesPlayed: s.matchesPlayed + 1,
          };
        }
        return s;
      });
      return updated.sort((a, b) => b.totalScore - a.totalScore).map((s, idx) => ({ ...s, rank: idx + 1 }));
    });
    addToast('success', 'Tableau des Scores', `Points injectés avec succès par l'arbitre.`);
  };

  // User Squad is index 0
  const userSquad = squads[0];

  const updateUserSquadName = (name: string, tag: string) => {
    setSquads((prev) =>
      prev.map((s, idx) => (idx === 0 ? { ...s, name, tag: tag.toUpperCase() } : s))
    );
    addToast('success', 'Escouade Actualisée', `Informations d'équipe enregistrées.`);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        userRole,
        setUserRole,
        language,
        setLanguage,
        t,
        theme,
        toggleTheme,
        currency,
        setCurrency,
        balanceFcfa,
        pendingBalanceFcfa,
        formatCurrency,
        convertFromFcfa,
        topUpBalance,
        deductBalance,
        sendP2PTransfer,
        withdrawals,
        requestWithdrawal,
        approveWithdrawal,
        tournaments,
        selectedGame,
        setSelectedGame,
        addTournament,
        checkInTournament,
        bracketNodes,
        rooms,
        selectedRoom,
        setSelectedRoom,
        updateRoomStatus,
        updateRoomCredentials,
        squads,
        selectedSquad,
        setSelectedSquad,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        poolFilter,
        setPoolFilter,
        updateSquadScore,
        userSquad,
        updateUserSquadName,
        communityPosts,
        addCommunityPost,
        likeCommunityPost,
        unreadCommunityCount,
        playerBadges,
        playerStats,
        referralCode,
        referralCount,
        referralEarningsFcfa,
        supportTickets,
        createSupportTicket,
        transactions,
        activeSubscriptionId,
        subscribeToTier,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        paymentModalDetails,
        openPaymentModal,
        isDocsModalOpen,
        setIsDocsModalOpen,
        isCreateTournamentModalOpen,
        setIsCreateTournamentModalOpen,
        isP2PModalOpen,
        setIsP2PModalOpen,
        isWithdrawModalOpen,
        setIsWithdrawModalOpen,
        toasts,
        addToast,
        removeToast,
        broadcastNotice,
        setBroadcastNotice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
