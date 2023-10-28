// make a fetch request to Google Books API with an isbn number
//  return the response as JSON
// export the response
export const getBookISBN = async (isbn: string) => {
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
    try{
        const response = await fetch(url);
        if(!response.ok){
            throw new Error('Network error');
        }
        const data = await response.json();
        return data;

    }catch(e)
    {console.log("error")
}
}

