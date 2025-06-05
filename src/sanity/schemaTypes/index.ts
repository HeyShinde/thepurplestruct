import { type SchemaTypeDefinition } from 'sanity'
import blogSchema from './post'
import categorySchema from './category'
import authorSchema from './author'
import projectSchema from './project'
import experienceSchema from './experience'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blogSchema, categorySchema, authorSchema, projectSchema, experienceSchema],
}
