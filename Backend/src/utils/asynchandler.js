// const asynchandler = (fn) => {
//     return (req , res , next) => {
//         Promise.resolve(fn(req , res , next)).catch((err) => next(err));
//     }
// }

// export default asynchandler;
const asynchandler = (requesthandler) => {
    return (req, res, next) => {
        Promise.resolve(requesthandler(req, res, next)).catch((err) => next(err))
    }
}


export { asynchandler }
