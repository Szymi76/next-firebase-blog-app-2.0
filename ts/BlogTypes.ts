interface BlogArticle {
  text: string;
  type: "text" | "code";
}

interface BlogSection {
  title: string;
  articles: BlogArticle[];
  image: any;
}

interface BlogComment {
  authorUID: string;
  displayName: string;
  photoURL: string;
  value: string;
  upvotes: string[];
  downvotes: string[];
  timestamp: number;
}

interface Blog {
  title: string;
  description: string;
  image: any;
  content: BlogSection[];
  tags: string[];
  likes: { uid: string; timestamp: number }[];
  authorUID: string;
  comments: BlogComment[];
  timestamp: number;
  linkName: string;
  public: boolean;
  hidden: boolean;
  views: { uid: string; timestamp: number }[];
}

export type { Blog, BlogSection, BlogArticle, BlogComment };
