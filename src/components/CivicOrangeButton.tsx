
import {Button} from "@chakra-ui/react";
import {ReactNode} from "react"

interface Props {
    onClick?: any,
    text?: ReactNode
    // any props that come into the component
}

export const CivicOrangeButton = ({onClick, text, ...props}: Props) => {

    return (
        <Button onClick={onClick} {...props} style={{backgroundColor: "#FF6B4E"}}>{text}</Button>
    )
}