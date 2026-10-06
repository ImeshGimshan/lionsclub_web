import {CogIcon} from '@sanity/icons/Cog'
import {HomeIcon} from '@sanity/icons/Home'
import {ImagesIcon} from '@sanity/icons/Images'
import {ProjectsIcon} from '@sanity/icons/Projects'
import {UserIcon} from '@sanity/icons/User'
import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Club website')
    .items([
      S.listItem()
        .title('Club settings')
        .id('siteSettings')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings').title('Club settings')),
      S.listItem()
        .title('Homepage')
        .id('homepage')
        .icon(HomeIcon)
        .child(S.document().schemaType('homepage').documentId('homepage').title('Homepage')),
      S.divider(),
      S.documentTypeListItem('project').title('Projects').icon(ProjectsIcon),
      S.documentTypeListItem('album').title('Gallery albums').icon(ImagesIcon),
      S.divider(),
      S.listItem()
        .title('Officers')
        .icon(UserIcon)
        .child(
          S.list()
            .title('Officers')
            .items([
              S.listItem()
                .title('Current officers')
                .child(
                  S.documentList()
                    .title('Current officers')
                    .filter('_type == "officer" && status == "current"')
                    .defaultOrdering([{field: 'order', direction: 'asc'}]),
                ),
              S.listItem()
                .title('Archived officers')
                .child(
                  S.documentList()
                    .title('Archived officers')
                    .filter('_type == "officer" && status == "archived"')
                    .defaultOrdering([
                      {field: 'serviceYear', direction: 'desc'},
                      {field: 'order', direction: 'asc'},
                    ]),
                ),
              S.divider(),
              S.documentTypeListItem('officer').title('All officers'),
            ]),
        ),
    ])
