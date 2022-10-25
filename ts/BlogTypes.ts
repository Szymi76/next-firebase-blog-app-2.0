interface BlogSection {
  title: string;
  articles: { text: string; type: "text" | "code" }[];
  image: { file: File | null; url: string | null };
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
  image: string;
  content: BlogSection[];
  tags: string[];
  likes: string[];
  authorUID: string;
  comments: BlogComment[];
  timestamp: number;
}

export type { Blog, BlogSection, BlogComment };
