import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  replies: Comment[];
}

interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  image?: string;
  video?: string;
  timestamp: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
  showComments: boolean;
}

const Index = () => {
  const [activeSection, setActiveSection] = useState('feed');
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'Анна Смирнова',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
      content: 'Посмотрите на этот потрясающий закат! 🌅',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      timestamp: '30 минут назад',
      likes: 156,
      liked: false,
      comments: [
        {
          id: 'cv1',
          author: 'Дмитрий Сидоров',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dmitry',
          content: 'Невероятные краски! Где снимали?',
          timestamp: '20 минут назад',
          replies: []
        }
      ],
      showComments: false
    },
    {
      id: '1b',
      author: 'Анна Смирнова',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
      content: 'Прекрасный день для новых открытий! 🌟',
      timestamp: '2 часа назад',
      likes: 24,
      liked: false,
      comments: [
        {
          id: 'c1',
          author: 'Иван Петров',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan',
          content: 'Полностью согласен! Отличный настрой',
          timestamp: '1 час назад',
          replies: [
            {
              id: 'c1r1',
              author: 'Анна Смирнова',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
              content: 'Спасибо! Желаю и тебе продуктивного дня 😊',
              timestamp: '30 минут назад',
              replies: []
            }
          ]
        }
      ],
      showComments: false
    },
    {
      id: '2',
      author: 'Михаил Козлов',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mikhail',
      content: 'Делюсь своим любимым видео о космосе 🚀',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      timestamp: '3 часа назад',
      likes: 89,
      liked: false,
      comments: [],
      showComments: false
    },
    {
      id: '3',
      author: 'Михаил Козлов',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mikhail',
      content: 'Наконец-то закончил проект! Целых три месяца работы 🎉',
      timestamp: '5 часов назад',
      likes: 42,
      liked: false,
      comments: [
        {
          id: 'c2',
          author: 'Елена Волкова',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
          content: 'Поздравляю! Это большое достижение 👏',
          timestamp: '4 часа назад',
          replies: []
        }
      ],
      showComments: false
    }
  ]);

  const [replyingTo, setReplyingTo] = useState<{postId: string, commentId?: string} | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const toggleComments = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, showComments: !post.showComments }
        : post
    ));
  };

  const handleAddPost = () => {
    if (!newPost.trim()) return;
    
    const post: Post = {
      id: Date.now().toString(),
      author: 'Вы',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
      content: newPost,
      timestamp: 'Только что',
      likes: 0,
      liked: false,
      comments: [],
      showComments: false
    };
    
    setPosts([post, ...posts]);
    setNewPost('');
  };

  const handleAddComment = (postId: string, commentId?: string) => {
    if (!replyText.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      author: 'Вы',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
      content: replyText,
      timestamp: 'Только что',
      replies: []
    };

    setPosts(posts.map(post => {
      if (post.id === postId) {
        if (!commentId) {
          return { ...post, comments: [...post.comments, newComment] };
        } else {
          const addReplyToComment = (comments: Comment[]): Comment[] => {
            return comments.map(comment => {
              if (comment.id === commentId) {
                return { ...comment, replies: [...comment.replies, newComment] };
              }
              if (comment.replies.length > 0) {
                return { ...comment, replies: addReplyToComment(comment.replies) };
              }
              return comment;
            });
          };
          return { ...post, comments: addReplyToComment(post.comments) };
        }
      }
      return post;
    }));

    setReplyText('');
    setReplyingTo(null);
  };

  const renderComment = (comment: Comment, postId: string, depth: number = 0) => (
    <div key={comment.id} className={`${depth > 0 ? 'ml-12 mt-3' : 'mt-4'}`}>
      <div className="flex gap-2">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={comment.avatar} />
          <AvatarFallback>{comment.author[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="bg-muted rounded-2xl px-3 py-2">
            <p className="font-medium text-sm">{comment.author}</p>
            <p className="text-sm">{comment.content}</p>
          </div>
          <div className="flex gap-4 mt-1 ml-3 text-xs text-muted-foreground">
            <button 
              className="hover:underline font-medium"
              onClick={() => setReplyingTo({postId, commentId: comment.id})}
            >
              Ответить
            </button>
            <span>{comment.timestamp}</span>
          </div>
          
          {replyingTo?.postId === postId && replyingTo?.commentId === comment.id && (
            <div className="flex gap-2 mt-3 ml-3">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" />
                <AvatarFallback>Вы</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Напишите ответ..."
                  className="rounded-full"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment(postId, comment.id);
                    }
                  }}
                />
              </div>
            </div>
          )}
          
          {comment.replies.map(reply => renderComment(reply, postId, depth + 1))}
        </div>
      </div>
    </div>
  );

  const navItems = [
    { id: 'feed', label: 'Лента', icon: 'Home' },
    { id: 'profile', label: 'Профиль', icon: 'User' },
    { id: 'friends', label: 'Друзья', icon: 'Users' },
    { id: 'messages', label: 'Сообщения', icon: 'MessageCircle' },
    { id: 'notifications', label: 'Уведомления', icon: 'Bell' },
    { id: 'search', label: 'Поиск', icon: 'Search' },
    { id: 'groups', label: 'Группы', icon: 'Users2' },
    { id: 'events', label: 'События', icon: 'Calendar' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
              f
            </div>
            <div className="relative">
              <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Поиск..." 
                className="pl-10 w-60 bg-muted border-0 rounded-full"
              />
            </div>
          </div>
          
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Icon name="Home" size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Icon name="Users" size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Icon name="MessageCircle" size={20} />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full bg-muted">
              <Icon name="Bell" size={20} />
            </Button>
            <Avatar className="h-9 w-9 cursor-pointer">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" />
              <AvatarFallback>Вы</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
          <aside className="hidden lg:block">
            <nav className="space-y-1 sticky top-20">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    activeSection === item.id 
                      ? 'bg-primary/10 text-primary' 
                      : 'hover:bg-muted text-foreground'
                  }`}
                >
                  <Icon name={item.icon as any} size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          <main className="max-w-2xl mx-auto w-full">
            {activeSection === 'feed' && (
              <div className="space-y-4">
                <Card className="p-4">
                  <div className="flex gap-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" />
                      <AvatarFallback>Вы</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder="Что у вас нового?"
                        className="min-h-[80px] resize-none border-0 bg-muted focus-visible:ring-0 rounded-xl"
                      />
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Icon name="Image" size={20} className="text-green-600" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Icon name="Video" size={20} className="text-red-600" />
                          </Button>
                        </div>
                        <Button 
                          onClick={handleAddPost}
                          disabled={!newPost.trim()}
                          className="rounded-lg"
                        >
                          Опубликовать
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                {posts.map(post => (
                  <Card key={post.id} className="overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={post.avatar} />
                          <AvatarFallback>{post.author[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{post.author}</p>
                          <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Icon name="MoreHorizontal" size={20} />
                        </Button>
                      </div>

                      <p className="text-sm mb-3">{post.content}</p>

                      {post.image && (
                        <img src={post.image} alt="" className="w-full rounded-lg mb-3" />
                      )}

                      {post.video && (
                        <div className="mb-3 rounded-lg overflow-hidden bg-black">
                          <video 
                            controls 
                            className="w-full"
                            preload="metadata"
                          >
                            <source src={post.video} type="video/mp4" />
                            Ваш браузер не поддерживает видео
                          </video>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3 pt-3 border-t">
                        <span>{post.likes} отметок «Нравится»</span>
                        <span>{post.comments.length} комментариев</span>
                      </div>

                      <div className="flex gap-1 pt-2 border-t">
                        <Button 
                          variant="ghost" 
                          className={`flex-1 gap-2 ${post.liked ? 'text-primary' : ''}`}
                          onClick={() => handleLike(post.id)}
                        >
                          <Icon name="ThumbsUp" size={18} />
                          Нравится
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="flex-1 gap-2"
                          onClick={() => toggleComments(post.id)}
                        >
                          <Icon name="MessageCircle" size={18} />
                          Комментировать
                        </Button>
                        <Button variant="ghost" className="flex-1 gap-2">
                          <Icon name="Share2" size={18} />
                          Поделиться
                        </Button>
                      </div>
                    </div>

                    {post.showComments && (
                      <div className="px-4 pb-4 border-t bg-muted/30">
                        <div className="flex gap-2 mt-4">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" />
                            <AvatarFallback>Вы</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <Input
                              value={replyingTo?.postId === post.id && !replyingTo?.commentId ? replyText : ''}
                              onChange={(e) => {
                                setReplyText(e.target.value);
                                setReplyingTo({postId: post.id});
                              }}
                              placeholder="Напишите комментарий..."
                              className="rounded-full"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleAddComment(post.id);
                                }
                              }}
                            />
                          </div>
                        </div>

                        {post.comments.map(comment => renderComment(comment, post.id))}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}

            {activeSection === 'profile' && (
              <Card className="p-6">
                <div className="text-center">
                  <Avatar className="h-32 w-32 mx-auto mb-4">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" />
                    <AvatarFallback>Вы</AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold mb-1">Ваше Имя</h2>
                  <p className="text-muted-foreground mb-4">Добро пожаловать в вашу социальную сеть!</p>
                  <div className="flex justify-center gap-4 text-sm">
                    <div>
                      <p className="font-bold text-lg">248</p>
                      <p className="text-muted-foreground">Друзей</p>
                    </div>
                    <div>
                      <p className="font-bold text-lg">125</p>
                      <p className="text-muted-foreground">Постов</p>
                    </div>
                    <div>
                      <p className="font-bold text-lg">1.2k</p>
                      <p className="text-muted-foreground">Подписчиков</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeSection !== 'feed' && activeSection !== 'profile' && (
              <Card className="p-8 text-center">
                <Icon name="Construction" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-bold mb-2">Раздел в разработке</h3>
                <p className="text-muted-foreground">Скоро здесь появится функционал "{navItems.find(n => n.id === activeSection)?.label}"</p>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;