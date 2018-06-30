type ImportObj = {
    default?: string
    named: undefined | string[]
    from: string
}

type Imports = {
    [key: string]: ImportObj
}