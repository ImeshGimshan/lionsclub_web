import {album} from './documents/album'
import {homepage} from './documents/homepage'
import {officer} from './documents/officer'
import {project} from './documents/project'
import {siteSettings} from './documents/siteSettings'
import {activity} from './objects/activity'
import {photo} from './objects/photo'
import {sectionHeading} from './objects/sectionHeading'

export const schemaTypes = [siteSettings, homepage, project, album, officer, activity, photo, sectionHeading]

/** Document types that exist exactly once. */
export const singletonTypes = new Set(['siteSettings', 'homepage'])
