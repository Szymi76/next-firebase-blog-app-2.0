import { Blog, BlogSection, BlogComment } from "./BlogTypes";

// dostępne akcje reducera
enum ActionTypes {
  BLOG_TITLE = "BLOG_TITLE", // title
  BLOG_DESCRIPTION = "DESCRIPTION", // description
  BLOG_IMAGE = "IMAGE", // image
  FINAL_DATA = "FINAL_DATA", // authorUID, tags, timestamp
  TITLE = "TITLE", // section title
  ARTICLE = "ARTICLE", // section article
  IMAGE = "IMAGE", // section image
}

// akcje dispatcha
interface BlogAction {
  type: ActionTypes;
  payload: any;
}

// przykładowa sekcja
const DEFAULT_SECTION: BlogSection = {
  title: "Propsy są niemutowalne",
  articles: [
    {
      text: "Propsów nie da się zmienić z wnętrza komponentu. A jeśli spróbujesz to pewnie Ci się uda, ale będziesz mieć ogromne problemy — niespójne dane na ekranie, a może nawet jakieś błędy. Generalnie: Straszne rzeczy. Co do zasady: Propsów nie zmieniamy z wnętrza komponentu, do którego zostały one przekazane. I kropka.",
      type: "text",
    },
    {
      text: "Jeszcze jedna mała uwaga: Do state nie dobierzesz się w funkcyjnych komponentach. Stąd też ich nazwa: Stateless Functional Components. Potrzebna będzie klasa. Skoro to jest już jasne, weźmy się za pisanie kodu:",
      type: "text",
    },
  ],
  image: {
    file: null,
    url: null,
  },
};

// przykładowy komentarz
const DEFAULT_COMMENT: BlogComment = {
  uid: "1",
  username: "Adam",
  photoURL:
    "https://res.cloudinary.com/practicaldev/image/fetch/s--5kWkErFS--/c_imagga_scale,f_auto,fl_progressive,h_100,q_auto,w_100/https://dev-to-uploads.s3.amazonaws.com/uploads/user/profile_image/366059/d2322733-1ef8-4f2b-b8e4-facef5397761.jpg",
  value: "Jakiś bardzo ciekawy komentarz",
  timestamp: 1666726388960,
};

// początkowy state
const INITIAL_STATE: Blog = {
  title: "Twój tytuł bloga...",
  description: "Opis bloga...",
  image:
    "https://cdn.corporate.walmart.com/dims4/WMT/572511c/2147483647/strip/true/crop/1920x1066+0+7/resize/980x544!/quality/90/?url=https%3A%2F%2Fcdn.corporate.walmart.com%2F7b%2F66%2F142c151b4cd3a19c13e1ca65f193%2Fbusinessfornature-banner.png",
  content: [DEFAULT_SECTION],
  authorUID: "1",
  tags: ["Tory", "Nauka"],
  likes: ["uid_1", "uid_2"],
  timestamp: 1666726388960,
  comments: [DEFAULT_COMMENT, DEFAULT_COMMENT],
};

// blog reducer
const blogReducer = (state: Blog, action: BlogAction) => {};
