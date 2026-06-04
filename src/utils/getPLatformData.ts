import soundcharts from '../database/Soundcharts.json'

type Stringarray = string[]

/** 
 * Filters the entire data with "filterName" taken as prop where "artist" is passed as value.
 * Filters again with "key" taken as prop where platform name(i.e spotify or youtube or etc.) is passed as value.
 * Returns an object with applied two filters.
*/
export const getPlatformData = (filterName: string, key: string) => {
    const newData = soundcharts?.filter((val) => val.artist === filterName)[0]
    let arr: Array<Stringarray> = []
    const length = Object.keys(newData).length
    for (let index = 0; index < length; index++) {
        const element = Object.entries(newData)[index];
        arr.push(element as string[])
    }
    const checkList = ["followers", "subscribers", "fans", "favorites"]
    const filteredPlatform = arr.filter((item) => item[0].split("_")[0].toLowerCase() === key.toLowerCase())
    const val = filteredPlatform.map((item) => {
        const data = item
        const splitArr = item[0].split("_")
        const dd = splitArr.map((item) => {
            if (checkList.includes(item)) {
                return "followers"
            } else {
                return item
            }
        })
        data[0] = dd.join("_")
        return data
    })
    return (Object.fromEntries(val))
}