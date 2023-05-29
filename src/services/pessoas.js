

export default (httpClient) => ({
    getPessoas: async (pessoa) => {
        try {
            const response = await httpClient.get("/Pessoa", pessoa)
            return response
        } catch (error) { console.log(error) }
    },

    addPessoa: async (pessoa) => {
        try {
            const response = await httpClient.post("/Pessoa", pessoa)
            return response
        } catch (error) { console.log(error) }
    },

    editarPessoa: async (id, pessoa) => {
        try {
            const response = await httpClient.put(`/Pessoa/${id}`, pessoa)
            return response
        } catch (error) { console.log(error) }
    },

    deletarPessoa: async (id) => {
        try {
            const response = await httpClient.delete(`/Pessoa/${id}`)
            return response
        } catch (error) { console.log(error) }
    },

    obterPessoaPorId: async (id) => {
        try {
            const response = await httpClient.get(`/Pessoa/${id}`)
            return response
        } catch (error) { console.log(error) }
    },


})