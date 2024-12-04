export const ZodErrorsDisplay = ({errors} : {errors: string[]}) => {
    if(!errors) return null
    return errors.map((error: string, idx: number) => (
        <div key={idx} className=" text-sm py-2 text-rose-600">
            {error}
        </div>
    ))  
}