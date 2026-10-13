/**
 * Local videos that also ship a VP9 .webm next to the .mp4. Only listed where the WebM is genuinely
 * smaller at the same quality (the turntables); for the other clips H.264 already wins.
 */
const localWebm = new Set(['/videos/color-black.mp4', '/videos/color-blue.mp4', '/videos/color-green.mp4'])

export const webmFor = (mp4: string) => (localWebm.has(mp4) ? mp4.replace(/\.mp4$/, '.webm') : null)
