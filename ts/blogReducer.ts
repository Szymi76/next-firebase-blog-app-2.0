import { Blog, BlogSection, BlogComment, BlogArticle } from "./BlogTypes";
import { createContext, Dispatch } from "react";

// dostępne akcje reducera
enum ActionTypes {
  BLOG = "BLOG", // cały blog
  BLOG_TITLE = "BLOG_TITLE", // title
  BLOG_DESCRIPTION = "DESCRIPTION", // description
  BLOG_IMAGE = "BLOG_IMAGE", // image
  ALL_SECTIONS = "ALL_SECTIONS", // content all sections
  TITLE = "TITLE", // section title
  ARTICLE = "ARTICLE", // section one article
  ALL_ACRTICLES = "ALL_ARTICLES", // section all articles
  IMAGE = "IMAGE", // section image
  TAGS = "TAGS", // tags
  FINAL_DATA = "FINAL_DATA", // authorUID, tags, timestamp
  HIDDEN = "HIDDEN", // blog ukryty \ nie ukryty
  LINK_NAME = "LINK_NAME", // blog ukryty \ nie ukryty
}

// akcje dispatcha
type BlogAction =
  | { type: ActionTypes.BLOG; payload: Blog }
  | { type: ActionTypes.BLOG_TITLE; payload: string }
  | { type: ActionTypes.BLOG_DESCRIPTION; payload: string }
  | { type: ActionTypes.BLOG_IMAGE; payload: any }
  | { type: ActionTypes.ALL_SECTIONS; payload: BlogSection[] }
  | { type: ActionTypes.TITLE; payload: { newValue: string; i: number } }
  | {
      type: ActionTypes.ARTICLE;
      payload: { newValue: BlogArticle; i: number; j: number };
    }
  | { type: ActionTypes.ALL_ACRTICLES; payload: { newValue: BlogArticle[]; i: number } }
  | { type: ActionTypes.IMAGE; payload: { newValue: any; i: number } }
  | { type: ActionTypes.TAGS; payload: string[] }
  | {
      type: ActionTypes.FINAL_DATA;
      payload: { authorUID: string; tags: string[]; timestamp: number };
    }
  | { type: ActionTypes.HIDDEN; payload: boolean }
  | { type: ActionTypes.LINK_NAME; payload: string };

// przykładowy artykuł
const DEFAULT_ARTICLE: BlogArticle = {
  text: "Propsów nie da się zmienić z wnętrza komponentu. A jeśli spróbujesz to pewnie Ci się uda, ale będziesz mieć ogromne problemy — niespójne dane na ekranie, a może nawet jakieś błędy. Generalnie: Straszne rzeczy. Co do zasady: Propsów nie zmieniamy z wnętrza komponentu, do którego zostały one przekazane. I kropka.",
  type: "text",
};

// przykładowa sekcja
const DEFAULT_SECTION: BlogSection = {
  title: "Propsy są niemutowalne",
  articles: [DEFAULT_ARTICLE, DEFAULT_ARTICLE],
  image:
    "https://images.unsplash.com/photo-1536532184021-da5392b55da1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Ymx1ZSUyMHNreXxlbnwwfHwwfHw%3D&w=1000&q=80",
};

// przykładowy komentarz
const DEFAULT_COMMENT: BlogComment = {
  authorUID: "1",
  displayName: "Adam",
  photoURL:
    "https://res.cloudinary.com/practicaldev/image/fetch/s--5kWkErFS--/c_imagga_scale,f_auto,fl_progressive,h_100,q_auto,w_100/https://dev-to-uploads.s3.amazonaws.com/uploads/user/profile_image/366059/d2322733-1ef8-4f2b-b8e4-facef5397761.jpg",
  value: "Jakiś bardzo ciekawy komentarz",
  upvotes: ["uid_1", "uid_2", "uid_3", "uid_4", "uid_5"],
  downvotes: ["uid_1", "uid_2"],
  timestamp: 1666726388960,
};

// początkowy state
const initialState: Blog = {
  title: "Twój tytuł bloga...",
  description: "Opis bloga...",
  image:
    "https://cdn.corporate.walmart.com/dims4/WMT/572511c/2147483647/strip/true/crop/1920x1066+0+7/resize/980x544!/quality/90/?url=https%3A%2F%2Fcdn.corporate.walmart.com%2F7b%2F66%2F142c151b4cd3a19c13e1ca65f193%2Fbusinessfornature-banner.png",
  content: [DEFAULT_SECTION, DEFAULT_SECTION],
  authorUID: "1",
  tags: ["Nowy"],
  likes: [],
  timestamp: 1666726388960,
  comments: [],
  linkName: "",
  public: false,
  hidden: true,
  views: [],
};

// blog reducer
const blogReducer = (state: Blog, action: BlogAction) => {
  const { type, payload } = action;

  switch (type) {
    // tytul calego bloga
    case ActionTypes.BLOG:
      return {
        ...payload,
      };
    case ActionTypes.BLOG_TITLE:
      return {
        ...state,
        title: payload,
      };
    // opis całego bloga
    case ActionTypes.BLOG_DESCRIPTION:
      return {
        ...state,
        description: payload,
      };
    // zdjęcie bloga
    case ActionTypes.BLOG_IMAGE:
      return {
        ...state,
        image: payload,
      };
    // zawartość całego kontentu
    case ActionTypes.ALL_SECTIONS:
      return {
        ...state,
        content: payload,
      };
    // tytuł konkretnej sekcji
    case ActionTypes.TITLE:
      return {
        ...state,
        content: state.content.map((s, i) =>
          i == payload.i ? { ...s, title: payload.newValue } : s
        ),
      };
    // zawartość konkretnego artykułu
    case ActionTypes.ARTICLE:
      return {
        ...state,
        content: state.content.map((s, i) =>
          i == payload.i
            ? {
                ...s,
                articles: s.articles.map((a, j) =>
                  j == payload.j ? payload.newValue : a
                ),
              }
            : s
        ),
      };
    // zawartośc całego konkretnego artykułu
    case ActionTypes.ALL_ACRTICLES:
      return {
        ...state,
        content: state.content.map((s, i) =>
          i == payload.i ? { ...s, articles: payload.newValue } : s
        ),
      };
    // zdjęcie konkretnej sekcji
    case ActionTypes.IMAGE:
      return {
        ...state,
        content: state.content.map((s, i) =>
          i == payload.i ? { ...s, image: payload.newValue } : s
        ),
      };
    // tagi
    case ActionTypes.TAGS:
      return {
        ...state,
        tags: payload,
      };
    // ostateczne dane do bloga
    case ActionTypes.FINAL_DATA:
      return {
        ...state,
        authorUID: payload.authorUID,
        tags: payload.tags,
        timestamp: payload.timestamp,
      };
    // tagi
    case ActionTypes.HIDDEN:
      return {
        ...state,
        hidden: payload,
      };
    // nazwa linku
    case ActionTypes.LINK_NAME:
      return {
        ...state,
        linkName: payload,
      };
    default:
      return state;
  }
};

interface BlogContextType {
  blog: Blog;
  dispatch: Dispatch<BlogAction>;
}

const BlogContext = createContext<BlogContextType>({
  blog: initialState,
  dispatch: () => null,
});

export {
  initialState,
  blogReducer,
  ActionTypes,
  BlogContext,
  DEFAULT_SECTION,
  DEFAULT_ARTICLE,
};
