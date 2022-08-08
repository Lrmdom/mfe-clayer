import type { NextPage } from "next"

import { ErrorContainer } from "components/composite/ErrorContainer"
import { Microstore } from "components/composite/Microstore"
import MicrostoreContainer from "components/composite/MicrostoreContainer"
import SkeletonLoader from "components/composite/SkeletonLoader"
import { BuyAllProvider } from "components/data/BuyAllProvider"
import { useDataFromUrl } from "components/hooks/useDataFromUrl"
import { useSettings } from "components/hooks/useSettings"

const Home: NextPage = () => {
  const { settings, isLoading, retryOnError } = useSettings()
  const { skus, couponCode, description, title } = useDataFromUrl()

  if (retryOnError) {
    return (
      <ErrorContainer
        errorCode="Connectivity issues"
        errorMessage="Try to reload the page"
      />
    )
  }

  if (isLoading || !settings) {
    return <SkeletonLoader />
  }

  return (
    <>
      <MicrostoreContainer settings={settings} couponCode={couponCode}>
        <BuyAllProvider settings={settings} skus={skus}>
          <Microstore
            skus={skus}
            couponCode={couponCode}
            title={title}
            description={description}
          />
        </BuyAllProvider>
      </MicrostoreContainer>
    </>
  )
}

export default Home
