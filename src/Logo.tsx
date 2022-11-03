import * as React from "react"
import {
    chakra,
    keyframes,
    ImageProps,
    forwardRef,
    usePrefersReducedMotion,
} from "@chakra-ui/react"
import logo from "./logo.svg"
import civicLogo from "./public/civic-logo-white.svg"

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

export const Logo = forwardRef<ImageProps, "img">((props, ref) => {
    const prefersReducedMotion = usePrefersReducedMotion()

    const animation = prefersReducedMotion
        ? undefined
        : `${spin} infinite 20s linear`
    //animation={animation}
    return <chakra.img src={civicLogo} ref={ref} {...props} />
})