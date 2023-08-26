import { proxy } from "valtio";

const map = new Map()

const state = proxy({
    map,
})

export default state;