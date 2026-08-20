import type { Project } from '../types/project'
import type { Translations } from '../i18n/translations'

/**
 * The project's topic + fokus tag line, e.g. "Mobilität • Forschung".
 *
 * Shared by the project card and the map-pin tooltip so both surfaces name the
 * topic that their colour stands for (SC 1.4.1 — the stripe on the card and the
 * pin fill on the map are both keyed to `topic[0]`). This deliberately includes
 * the *first* topic: dropping it was the original 1.4.1 failure, since a
 * single-topic project then rendered no topic text at all.
 */
/** Bullet separator, set with thin spaces (U+2009) rather than normal spaces —
 *  a full space either side reads as too loose at the tag line's size. */
const TAG_SEPARATOR = '\u2009\u2022\u2009'

export function formatProjectTags(project: Project, t: Translations): string {
  return [
    ...project.filters.topic.map((v) => t.topicLabels[v] ?? v),
    ...project.filters.fokus.map((v) => t.fokusLabels[v] ?? v),
  ].join(TAG_SEPARATOR)
}
