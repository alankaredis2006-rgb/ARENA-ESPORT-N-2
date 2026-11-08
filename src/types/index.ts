export type CurrencyCode = 'FCFA' | 'EUR' | 'USD' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateToFcfa: number; // 1 unit in FCFA
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  FCFA: { code: 'FCFA', symbol: 'FCFA', name: 'Franc CFA (XAF/XOF)', rateToFcfa: 1 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rateToFcfa: 655.957 },
  USD: { code: 'USD', symbol: '$', name: 'Dollar US', rateToFcfa: 610.0 },
  GBP: { code: 'GBP', symbol: '£', name: 'Livre Sterling', rateToFcfa: 765.0 },
};

export type UserRole = 'player' | 'captain' | 'admin';

export type GameTitle = 'Free Fire' | 'PUBG Mobile';

export type CompetitionFormat =
  | 'Battle Royale multi-étapes'
  | 'Élimination Directe'
  | 'Double Élimination'
  | 'Système Suisse'
  | 'Ligue / Scrims';

export interface Tournament {
  id: string;
  title: string;
  subtitle: string;
  game: GameTitle; // Free Fire or PUBG Mobile
  isOfficial: boolean; // TRUE for Admin official tournament with cashprize
  cashprizeFcfa: number;
  entryFeeFcfa: number;
  organizerName: string;
  organizerRole: UserRole;
  status: 'live' | 'upcoming' | 'completed';
  map: string; // Bermuda, Purgatory, Erangel, Miramar, Kalahari
  registeredSquads: number;
  maxSquads: number | null; // null for unlimited capacity!
  isUnlimitedSquads?: boolean;
  maxPlayers?: number | null;
  isUnlimitedPlayers?: boolean;
  maxGroups?: number | null;
  isUnlimitedGroups?: boolean;
  playersPerTeam?: number; // 1, 2, 4
  squadsPerGroup?: number; // e.g. 20, 25, 48, etc.
  competitionFormat?: CompetitionFormat;
  restrictions?: string; // 'Toutes les équipes' | 'Réservé aux Guildes' | etc.
  isGuildOnly?: boolean;
  participatingGuilds?: string[];
  startTime: string;
  roomsCount: number;
  description: string;
  bannerGradient: string;
  checkInOpen?: boolean;
  mvpPlayer?: {
    name: string;
    squad: string;
    kills: number;
    score: number;
  };
}

export interface TournamentGroup {
  id: string; // e.g. "grp-0", "grp-1"
  tournamentId: string;
  name: string; // "Groupe A", "Groupe B", ... "Groupe AA"
  code: string; // "A", "B", "AA"
  maxCapacity: number | null; // null for unlimited
  squadIds: string[];
  isCompleted?: boolean;
  qualifiedCount?: number; // top N squads qualify
  notes?: string;
}

export type GuildRole = 'founder' | 'leader' | 'co_leader' | 'officer' | 'recruiter' | 'member' | 'recruit';

export interface GuildMember {
  id: string;
  userId: string;
  gamerTag: string;
  role: GuildRole;
  joinedAt: string;
  country: string;
  countryFlag: string;
  rankScore: number;
  kills: number;
  avatarUrl?: string;
  inGameIdFF?: string;
  inGameIdPUBG?: string;
}

export interface GuildApplication {
  id: string;
  userId: string;
  gamerTag: string;
  appliedAt: string;
  message: string;
  countryFlag: string;
}

export interface GuildPalmaresEntry {
  id: string;
  title: string;
  season: string;
  rank: '1er' | '2e' | '3e';
  prizeFcfa: number;
}

export interface Guild {
  id: string; // e.g. "GLD-AFW-01"
  tag: string; // e.g. "[AFW]"
  name: string; // "AFRICA WARRIORS"
  emblem: string; // URL or icon key
  country: string; // "Gabon"
  countryFlag: string; // 🇬🇦
  founderName: string;
  founderId: string;
  leaderName: string;
  leaderId: string;
  description: string;
  motto: string; // Devise / Slogan
  primaryGame: GameTitle; // Free Fire or PUBG Mobile
  secondaryGames: string[];
  isPublic: boolean; // Public (open join) or Private (application required)
  createdAt: string;
  maxMembers: number | null; // null for unlimited!
  isUnlimitedMembers: boolean;
  members: GuildMember[];
  pendingApplications: GuildApplication[];
  stats: {
    trophies: number;
    tournamentsPlayed: number;
    top1Victories: number;
    totalKills: number;
    winRatePercent: number;
    globalRank: number;
    countryRank: number;
    points: number;
  };
  palmares: GuildPalmaresEntry[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminName: string;
  changeDescription: string;
}

export interface PlatformLimitsSettings {
  allowUnlimitedTournaments: boolean;
  defaultTournamentSquadCap: number | null; // null for unlimited
  defaultSquadsPerGroup: number;
  maxGroupsAllowed: number | null; // null for unlimited
  allowUnlimitedGuildMembers: boolean;
  defaultGuildMemberCap: number | null; // null for unlimited
  enforceSingleGuildPerGame: boolean;
  officialTournamentsAdminOnly: boolean;
  lastUpdated: string;
  updatedBy: string;
  auditLog: AuditLogEntry[];
}

// Generate infinite unique group names: A, B, ... Z, AA, AB, ...
export function getGroupNameFromIndex(index: number): string {
  let name = '';
  let num = index;
  while (num >= 0) {
    name = String.fromCharCode(65 + (num % 26)) + name;
    num = Math.floor(num / 26) - 1;
  }
  return `Groupe ${name}`;
}

export interface P2PTransferRequest {
  recipientArenaId: string;
  recipientName: string;
  amountFcfa: number;
  note?: string;
}

export interface WithdrawalRequest {
  id: string;
  date: string;
  amountFcfa: number;
  method: 'mobile_money' | 'bank';
  accountDetails: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  reference: string;
}

export interface SupportTicket {
  id: string;
  date: string;
  category: 'payment' | 'match_dispute' | 'anti_cheat' | 'account';
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  adminReply?: string;
}

export interface MatchBracketNode {
  id: string;
  round: 'Quarts de Finale' | 'Demi-Finales' | 'Grande Finale';
  matchNumber: number;
  teamA: { name: string; tag: string; score: number; isWinner?: boolean };
  teamB: { name: string; tag: string; score: number; isWinner?: boolean };
  status: 'live' | 'completed' | 'scheduled';
}

export interface CommunityPost {
  id: string;
  author: string;
  authorRole: UserRole;
  squadTag?: string;
  flag: string;
  timeAgo: string;
  content: string;
  likes: number;
  hasLiked?: boolean;
  repliesCount: number;
  badge?: string;
}

export interface PlayerBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlockedAt: string;
}

export interface SquadMember {
  id: string;
  name: string;
  inGameId: string; // Free Fire UID (e.g. 84920491)
  role: 'Capitaine' | 'Fragger' | 'Sniper' | 'Rusher' | 'Support';
  kills: number;
  avatarUrl?: string;
}

export interface Squad {
  id: string;
  name: string;
  tag: string;
  country: string;
  countryCode: string;
  flag: string;
  pool: 'Pool A' | 'Pool B' | 'Pool C' | 'Pool D';
  captainName: string;
  members: SquadMember[];
  matchesPlayed: number;
  totalKills: number;
  placementPoints: number;
  totalScore: number;
  status: 'qualifiée' | 'en_course' | 'éliminée';
  rank: number;
  isUserSquad?: boolean;
}

export type RoomStatus = 'live' | 'standby' | 'completed';

export interface RoomKillEvent {
  id: string;
  timestamp: string;
  killer: string;
  killerSquad: string;
  victim: string;
  victimSquad: string;
  weapon: string;
}

export interface RoomScoreEntry {
  rank: number;
  squadName: string;
  squadTag: string;
  kills: number;
  placementPts: number;
  totalPts: number;
  isAlive: boolean;
}

export interface Room {
  id: string;
  number: number; // 1 to 10
  name: string;
  title: string;
  stage: string;
  map: 'Bermuda' | 'Purgatory' | 'Kalahari' | 'Alpine' | 'NexTerra';
  status: RoomStatus;
  scheduledTime: string;
  gameRoomId: string; // Free Fire Room ID
  gamePassword: string; // Free Fire Secret Password
  totalSquads: number;
  maxSquads: number;
  squads: string[];
  streamUrl?: string;
  liveViewers?: number;
  killsFeed: RoomKillEvent[];
  scoreboard: RoomScoreEntry[];
}

export type PaymentMethod = 'nexus_airtel' | 'nexus_moov' | 'nexus_orange' | 'nexus_mtn' | 'visa_mastercard';

export interface MobileMoneyCountry {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
  providers: { id: PaymentMethod; name: string; color: string; logoText: string }[];
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amountFcfa: number;
  amountFormatted: string;
  type: 'topup' | 'tournament_entry' | 'subscription' | 'cashprize';
  status: 'success' | 'pending' | 'failed';
  provider: string;
  reference: string;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  priceFcfaMonthly: number;
  priceFcfaSeason: number;
  badge: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}
