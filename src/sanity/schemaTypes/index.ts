import { type SchemaTypeDefinition } from 'sanity'
import blogSchema from './post'
import categorySchema from './category'
import authorSchema from './author'
import projectSchema from './project'
import experienceSchema from './experience'
import researchSchema from './research'
import courseSchema from './course'
import sectionSchema from './section'
import lessonSchema from './lesson'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blogSchema, categorySchema, authorSchema, projectSchema, experienceSchema, researchSchema, courseSchema, sectionSchema, lessonSchema],
}
