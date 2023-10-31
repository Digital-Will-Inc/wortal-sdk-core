import { InviteSectionType } from "../types/context-payload-property-types";

/**
 * Represents a section in the inviteAsync dialog that contains suggested matches. The sections will be shown in the
 * order they are included in the array, and the last section will contain as many results as possible.
 */
export interface InviteSection {
    /**
     * The type of section to include in the inviteAsync dialog
     */
    sectionType: InviteSectionType;
    /**
     * Optional maximum number of results to include in the section. This can be no higher than 10. This will be
     * disregarded for the last section, which will contain as many results as possible. If not included, the default
     * maximum number of results for that section type will be used.
     */
    maxResults?: number;
}
