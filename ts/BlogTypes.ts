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
  uid: string;
  value: string;
  username: string;
  photoURL: string;
  timestamp: number;
}

interface Blog {
  title: string;
  description: string;
  image: any;
  content: BlogSection[];
  tags: string[];
  likes: string[];
  authorUID: string;
  comments: BlogComment[];
  timestamp: number;
  linkName: string;
  public: boolean;
  hidden: boolean;
}

export type { Blog, BlogSection, BlogArticle, BlogComment };
