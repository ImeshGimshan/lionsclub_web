import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes, singletonTypes} from './schemaTypes'
import {structure} from './structure'

export default defineConfig({
  // Public website content.
  name: 'website',
  title: 'Website content',
  basePath: '/website',
  projectId: 'zhxlfgcp',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
    // Club settings is a singleton: hide it from "Create new".
    templates: (templates) => templates.filter(({schemaType}) => !singletonTypes.has(schemaType)),
  },

  document: {
    // Singletons cannot be duplicated, deleted or unpublished.
    actions: (actions, {schemaType}) =>
      singletonTypes.has(schemaType)
        ? actions.filter(({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : actions,
  },
})
