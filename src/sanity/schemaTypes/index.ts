import { SchemaTypeDefinition } from "sanity";
import course from './course';
import lesson from './lesson';
import section from './section';
import post from "./post";
import research from "./research";
import experience from "./experience";
import project from "./project";
import katexBlock from "./katexBlock";
import category from "./category";
import author from "./author";
import navigation from "./navigation";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [course, lesson, section, post, research, experience, project, katexBlock, category, author, navigation],
};
