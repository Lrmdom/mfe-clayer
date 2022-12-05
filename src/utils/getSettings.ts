import { CommerceLayer, Organization } from "@commercelayer/sdk"

import { getInfoFromJwt } from "./getInfoFromJwt"
import { getOrganizationsDetails } from "./getOrganizationDetails"
import { isValidHost } from "./isValidHost"

// default settings are by their nature not valid to show a full cart
// they will be used as fallback for errors or 404 page
export const defaultSettings: InvalidSettings = {
  isValid: false,
  primaryColor: "#000000",
  faviconUrl:
    "https://data.commercelayer.app/assets/images/favicons/favicon-32x32.png",
  companyName: "Commerce Layer",
  retryable: false,
}

const makeInvalidSettings = ({
  retryable,
  organization,
}: {
  retryable?: boolean
  organization?: Organization
}): InvalidSettings => ({
  ...defaultSettings,
  retryable: !!retryable,
  logoUrl: organization?.logo_url,
  companyName: organization?.name || defaultSettings.companyName,
  primaryColor: organization?.primary_color || defaultSettings.primaryColor,
  faviconUrl: organization?.favicon_url || defaultSettings.faviconUrl,
})

/**
 * Retrieves a list of `Settings` required to show the cart page
 *
 * @param accessToken - Access Token for a sales channel API credentials to be used to authenticate all Commerce Layer API requests.
 * Read more at {@link https://docs.commercelayer.io/developers/authentication/client-credentials#sales-channel}
 * @param orderId - Order Id used to show cart info details.
 * Read more at {@link https://docs.commercelayer.io/developers/api-specification#base-endpoint}.
 *
 * @returns an union type of `Settings` or `InvalidSettings`
 */
export const getSettings = async ({
  accessToken,
}: {
  accessToken: string
}): Promise<Settings | InvalidSettings> => {
  // TODO: read from config
  const domain = import.meta.env.PUBLIC_DOMAIN || "commercelayer.io"
  const { slug } = getInfoFromJwt(accessToken)

  if (!slug) {
    return makeInvalidSettings({})
  }

  // checking app consistency
  const hostname = typeof window && window.location.hostname
  if (!isValidHost(hostname, accessToken)) {
    return makeInvalidSettings({})
  }

  const client = CommerceLayer({
    organization: slug,
    accessToken,
    domain,
  })

  const organizationResponse = await getOrganizationsDetails({
    client,
  })

  // validating organization
  const organization = organizationResponse?.object
  if (!organization) {
    return makeInvalidSettings({
      retryable: !organizationResponse?.bailed,
    })
  }

  return {
    accessToken,
    endpoint: `https://${slug}.${domain}`,
    slug,
    logoUrl: organization.logo_url,
    companyName: organization.name || defaultSettings.companyName,
    primaryColor: organization.primary_color || defaultSettings.primaryColor,
    faviconUrl: organization.favicon_url || defaultSettings.faviconUrl,
    isValid: true,
  }
}
