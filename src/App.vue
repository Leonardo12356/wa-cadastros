<template>
  <div class="app">
    <h1>Cadastro de Pessoas</h1>
    <button @click="openModal">Novo</button>

    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>CPF</th>
          <th>Data de Nascimento</th>
          <th>Endereço</th>
          <th>Sexo</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="person in people" :key="person.id">
          <td>{{ person.nome }}</td>
          <td>{{ person.cpf }}</td>
          <td>{{ person.dataNascimento }}</td>
          <td>{{ person.endereco }}</td>
          <td>{{ person.sexo }}</td>
          <td>
            <button @click="editPerson(person)">Editar</button>
            <button @click="confirmDelete(person)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="modalOpen" class="modal">
      <div class="modal-content">
        <h2>{{ modalTitle }}</h2>
        <form @submit.prevent="savePerson">
          <div class="cada-campo">
            <label for="nome">Nome:</label>
            <input type="text" id="nome" v-model="form.nome" required>
          </div>

          <div class="cada-campo">
            <label for="cpf">CPF:</label>
            <input type="text" id="cpf" v-model="form.cpf" required>
          </div>

          <div class="cada-campo">
            <label for="dataNascimento">Data de Nascimento:</label>
            <input type="date" id="dataNascimento" v-model="form.dataNascimento" required>
          </div>

          <div class="cada-campo">
            <label for="endereco">Endereço:</label>
            <input type="text" id="endereco" v-model="form.endereco" required>
          </div>

          <div class="cada-campo">
            <label for="sexo">Sexo:</label>
            <div class="cada-campo">
              <input type="radio" id="masculino" v-model="form.sexo" value="Masculino">
              <label for="masculino">Masculino</label>
            </div>
            <div class="cada-campo-fen">
              <input type="radio" id="feminino" v-model="form.sexo" value="Feminino">
              <label for="feminino">Feminino</label>
            </div>
          </div>

          <div class="botoes">
            <button type="submit">Salvar</button>
            <button @click="cancelModal">Cancelar</button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>


<script>
import services from './services'

export default {
  data() {
    return {
      people: [],
      form: {
        id: null,
        nome: '',
        cpf: '',
        dataNascimento: '',
        endereco: '',
        sexo: []
      },
      modalOpen: false,
      modalTitle: ''
    };
  },
  mounted() {
    this.fetchPeople();
  },
  methods: {
    formatDateString: function (date) {
      const dateFormated = new Date(date);
      return dateFormated.toISOString();
    },
    fetchPeople() {
      services.pessoas.getPessoas()
        .then(response => {
          this.people = response.data.map(person => ({
            ...person,
            dataNascimento: this.formatDate(person.dtNascimento)
          }));
          console.log(this.people);
        })
        .catch(error => {
          console.error(error);
        });
    },

    openModal() {
      this.modalOpen = true;
      this.modalTitle = 'Nova Pessoa';
      this.form = {
        id: null,
        nome: '',
        cpf: '',
        dataNascimento: '',
        endereco: '',
        sexo: []
      };
    },
    editPerson(person) {
      this.modalOpen = true;
      this.modalTitle = 'Editar Pessoa';
      this.form = { ...person };
    },
    savePerson() {
      if (this.form.id) {
        const pessoa = {
          id: this.form.id,
          nome: this.form.nome,
          cpf: this.form.cpf,
          dtNascimento: this.formatDateString(this.form.dataNascimento),
          endereco: this.form.endereco,
          sexo: this.form.sexo
        }
        // Editar pessoa existente
        services.pessoas.editarPessoa(this.form.id, pessoa)
          .then(() => {
            this.fetchPeople();
            this.closeModal();
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        const pessoa = {
          nome: this.form.nome,
          cpf: this.form.cpf,
          dtNascimento: this.formatDateString(this.form.dataNascimento),
          endereco: this.form.endereco,
          sexo: this.form.sexo
        }
        // Cadastrar nova pessoa
        services.pessoas.addPessoa(pessoa)
          .then(() => {
            this.fetchPeople();
            this.closeModal();
          })
          .catch(error => {
            console.error(error);
          });
      }
    },
    cancelModal() {
      this.closeModal();
    },
    closeModal() {
      this.modalOpen = false;
      this.modalTitle = '';
      this.form = {
        id: null,
        nome: '',
        cpf: '',
        dataNascimento: '',
        endereco: '',
        sexo: []
      };
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('pt-BR', options);
    },
    confirmDelete(person) {
      const confirmDelete = confirm('Deseja excluir esta pessoa?');
      if (confirmDelete) {
        services.pessoas.deletarPessoa(person.id)
          .then(() => {
            this.fetchPeople();
          })
          .catch(error => {
            console.error(error);
          });
      }
    }
  }
};
</script>


<style scoped>
body {
  font-family: Arial, sans-serif;
  text-align: left;
  width: 100%;
  height: 100%;
}

button {
  cursor: pointer;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

table {
  border-collapse: separate;
  text-indent: initial;
  text-align: left;
  border-spacing: 0px;
  width: 100%;
  padding: 5px;
  border: none;
}

tbody td {
  border: none;
  padding: 2px;
}

tbody tr:hover {
  background-color: rgba(185, 185, 185, 0.7);
}

tbody tr:nth-child(odd):hover {
  background-color: rgba(185, 185, 185, 0.4);
}

tbody tr:nth-child(odd) {
  border: none;
  background-color: #f3f2f2;
}

thead tr {
  background-color: rgba(185, 185, 185, 0.7);
  padding: 5px;
}

td {
  border: none;
  padding: 5px;
}

td:last-child {
  border: none;
  padding: 5px;
  justify-content: center;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  display: flex;
  flex-direction: column;
  width: 60%;
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
}

.cada-campo {
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: 10px;
}

.cada-campo:last-child {
  margin-bottom: 0;
}

label {
  width: 120px;
}

input[type="text"],
input[type="date"] {
  flex: 1;
  padding: 5px;
}

input[type="radio"] {
  margin-right: 5px;
}

.botoes {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.modal h2 {
  margin-bottom: 10px;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}
</style>

