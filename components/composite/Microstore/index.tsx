import {
  SkusContainer,
  Skus,
  ItemContainer,
  PricesContainer,
  AvailabilityContainer,
} from "@commercelayer/react-components"

import { BuyAllButton } from "../BuyAllButton"

import { Hero } from "components/composite/Hero"
import { Product } from "components/composite/Product"

import { Wrapper } from "./styled"

interface Props {
  skus?: SkuWithQuantity[]
  title?: string
  description?: string
  couponCode?: string
  settings: Settings
  showBuyAll?: boolean
}

export const Microstore = ({
  skus = [],
  title,
  description,
  couponCode,
  settings,
  showBuyAll,
}: Props) => {
  if (skus.length === 0)
    return (
      <div className="py-10 font-bold" data-test-id="no-skus-found">
        We could not find any products to display. Please check your URL and try
        again.
      </div>
    )

  return (
    <>
      <Hero title={title} description={description} couponCode={couponCode} />

      {showBuyAll && (
        <BuyAllButton
          settings={settings}
          onSuccess={(order) => (window.location.href = order.cart_url || "")}
        />
      )}

      {
        <Wrapper>
          <SkusContainer skus={skus.map(({ skuCode }) => skuCode)}>
            <ItemContainer>
              <PricesContainer>
                <AvailabilityContainer>
                  <Skus>
                    <Product />
                  </Skus>
                </AvailabilityContainer>
              </PricesContainer>
            </ItemContainer>
          </SkusContainer>
        </Wrapper>
      }
    </>
  )
}
