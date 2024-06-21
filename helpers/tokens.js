const generarId = () => Math.random().toString(32) + Date.now().toString(32);

export {
    generarId
}
