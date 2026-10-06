import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes, singletonTypes} from './schemaTypes'
import {enquiriesStructure, enquirySchemaTypes} from './schemaTypes/enquiries'
import {structure} from './structure'

const projectId = 'zhxlfgcp'

export default defineConfig([
  {
    // Public website content.
    name: 'website',
    title: 'Website content',
    basePath: '/website',
    projectId,
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
  },
  {
    // Form submissions. A private dataset: never readable by the public website.
    name: 'enquiries',
    title: 'Enquiries',
    subtitle: 'Private',
    basePath: '/enquiries',
    projectId,
    dataset: 'enquiries',

    plugins: [structureTool({structure: enquiriesStructure, title: 'Enquiries'})],

    schema: {types: enquirySchemaTypes},

    document: {
      // Enquiries are records, not drafts to duplicate.
      actions: (actions) => actions.filter(({action}) => action !== 'duplicate'),
    },
  },
])
