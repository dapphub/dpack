const loadModule = async (name, prop) => {
    const module = await import(name)
    return module[prop]
}

module.exports = {
    loadModule
}
