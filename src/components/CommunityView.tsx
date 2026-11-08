import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Send,
  Heart,
  MessageCircle,
  Share2,
  ShieldCheck,
  Gamepad2,
  Sparkles,
  Users,
  Flame,
} from 'lucide-react';

export const CommunityView: React.FC = () => {
  const {
    communityPosts,
    addCommunityPost,
    likeCommunityPost,
    userRole,
    unreadCommunityCount,
    userSquad,
  } = useApp();

  const [newPostContent, setNewPostContent] = useState('');
  const [selectedTag, setSelectedTag] = useState<'Tous' | 'Annonces' | 'Recrutement' | 'Tournois Fun'>('Tous');

  const isAdmin = userRole === 'admin';

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const badge = isAdmin ? 'Annonce Officielle Admin' : 'Discussion Joueur';
    addCommunityPost(newPostContent.trim(), badge);
    setNewPostContent('');
  };

  const filteredPosts = communityPosts.filter((p) => {
    if (selectedTag === 'Tous') return true;
    if (selectedTag === 'Annonces') return p.badge?.includes('Officielle');
    if (selectedTag === 'Recrutement') return p.badge?.includes('Recrutement');
    if (selectedTag === 'Tournois Fun') return p.badge?.includes('Fun');
    return true;
  });

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      
      {/* Community Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <MessageSquare className="w-4 h-4" />
            <span>Espace Échange & Recrutement Compétitif</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span>Communauté ARENA E-SPORT</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500 text-black shadow-md shadow-emerald-500/30">
              {unreadCommunityCount} en ligne
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Discussions des capitaines, annonces d'arbitrage, recherche de coéquipiers et scrims funs.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/80 border border-white/10 text-xs overflow-x-auto">
          {['Tous', 'Annonces', 'Recrutement', 'Tournois Fun'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag as any)}
              className={`px-3 py-1.5 font-semibold rounded-xl transition-all whitespace-nowrap ${
                selectedTag === tag
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* New Post Creator Box */}
      <div className="p-5 rounded-3xl glass-panel border border-white/10 space-y-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl overflow-hidden border border-white/20 p-0.5 bg-slate-900 shrink-0">
            <img
              src="/assets/aistudio/image_34c6e627.jpeg"
              alt="Avatar"
              className="w-full h-full object-cover rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-xs">
            <span className="font-bold text-white block">
              {isAdmin ? 'Super Administrateur ARENA' : userSquad.captainName}
            </span>
            <span className="text-slate-400">
              {isAdmin ? 'Publication officielle avec badge admin' : `Capitaine ${userSquad.name}`}
            </span>
          </div>
        </div>

        <form onSubmit={handlePostSubmit} className="space-y-3">
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder={
              isAdmin
                ? "Diffuser une annonce officielle pour toutes les escouades..."
                : "Partager une tactique, proposer un scrim fun amical ou recruter un joueur..."
            }
            rows={3}
            className="w-full p-3.5 rounded-2xl glass-input text-xs text-white placeholder-slate-500 resize-none"
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">
              {isAdmin ? '⚡ Priorité maximale dans le flux' : 'Respectez les règles d’e-sport'}
            </span>

            <button
              type="submit"
              className="py-2 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publier</span>
            </button>
          </div>
        </form>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const isPostAdmin = post.authorRole === 'admin';

          return (
            <div
              key={post.id}
              className={`p-5 sm:p-6 rounded-3xl border transition-all duration-300 backdrop-blur-2xl ${
                isPostAdmin
                  ? 'bg-gradient-to-br from-cyan-950/40 via-purple-950/40 to-slate-900/80 border-cyan-500/40 shadow-xl shadow-cyan-500/10'
                  : 'glass-card border-white/10'
              } space-y-3`}
            >
              {/* Author & Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl leading-none">{post.flag}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-xs sm:text-sm">
                        {post.author}
                      </span>
                      {post.squadTag && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          {post.squadTag}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">{post.timeAgo}</span>
                  </div>
                </div>

                {post.badge && (
                  <span
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider ${
                      isPostAdmin
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    }`}
                  >
                    {post.badge}
                  </span>
                )}
              </div>

              {/* Message Content */}
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                {post.content}
              </p>

              {/* Actions Footer */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => likeCommunityPost(post.id)}
                    className={`flex items-center gap-1.5 transition-colors ${
                      post.hasLiked ? 'text-red-400 font-bold' : 'hover:text-white'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${post.hasLiked ? 'fill-current text-red-400' : ''}`}
                    />
                    <span className="tabular-nums">{post.likes}</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-slate-400">
                    <MessageCircle className="w-4 h-4" />
                    <span className="tabular-nums">{post.repliesCount} réponses</span>
                  </div>
                </div>

                <button className="text-slate-400 hover:text-white transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
