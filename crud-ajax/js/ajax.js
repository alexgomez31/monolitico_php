$(function(){
    // Oculta el elemento con ID del task-result al cargar la página
    $("#task-result").hide();
    
    // Llama a la función fetchTasks al cargar la página.
    fetchTasks();
    
    // Variable que indica si la tarea está en modo de edición
    let edit = false;

  

    // Cuando se envía el formulario task-form
    $("#task-form").submit(e => {
        e.preventDefault();
        // Obtiene los valores del formulario
        const postData = {
            name: $("#name").val(),
            description: $("#description").val(),
            id: $("#taskId").val()
        }

        // Decide cuañ  url usar para la solicitud AJAX en funcion del modo de edicion
        const url = edit === false ? "php/agregar-tarea.php" : "php/editar-tarea.php";

        // Realiza una solicitud AJAX para agregar o editar una tarea
        $.ajax({
            url,
            data: postData,
            type: "POST",
            success: function (response) {
                if (!response.error) {
                    // Si la operación es exitosa, vuelve a cargar las tareas y reinicia el formulario+
                    fetchTasks();
                    $("#task-form").trigger("reset");
                }
            }
        });
    });

    // Función que carga todas las tareas desde el servidor
    function fetchTasks() {
        $.ajax({
            url: "php/listar-tareas.php",
            type: "GET",
            success: function(response){
                // Parsea la respuesta JSON y crea una tabla de tareas en la página
                const tasks = JSON.parse(response);
                let template = "";
                tasks.forEach(task => {
                    template += `
                    <tr taskId="${task.id}">
                        <td>${task.id}</td>
                        <td>${task.name}</td>
                        <td>${task.description}</td>
                        <td>
                            <button class="btn btn-danger task-delete">Eliminar</button>
                            <button class="btn btn-warning task-item "  data-toggle="modal" data-target="#exampleModal">Modificar</button>
                        </td>
                    </tr>`;
                });
                // Agrega la tabla de tareas al elemento con ID tasks
                $("#tasks").html(template);
            }
        });
    }

    // Cuando se hace clic en un botón "Eliminar" dentro de la tabla de tareas
    $(document).on("click", ".task-delete", () => {
        if (confirm("¿Seguroski que quieres eliminar esa tarea?")) {
            // Obtiene el ID de la tarea a eliminar y realiza una solicitud AJAX para eliminarla
            const element = $(this)[0].activeElement.parentElement.parentElement;
            const id = $(element).attr("taskId");
            $.post("php/eliminar-tarea.php", { id }, () => {
                // Vuelve a cargar las tareas después de eliminar.
                fetchTasks();
            });
        }
    });

    // Cuando se hace clic en un botón "Modificar" dentro de la tabla de tareas
    $(document).on("click", ".task-item", () => {
        // Obtiene el ID de la tarea a modificar y realiza una solicitud AJAX para obtener sus detalles
        const element = $(this)[0].activeElement.parentElement.parentElement;
        const id = $(element).attr("taskId");
        let url = "php/obtener-una-tarea.php";
        $.ajax({
            url,
            data: {id},
            type: "POST",
            success: function(response){
                if(!response.error){
                    // convierte la respuesta JSON y muestra los detalles de la tarea en el formulario
                    const task = JSON.parse(response);
                    $("#name").val(task.name)
                    $("#description").val(task.description)
                    $("#taskId").val(task.id)
                    edit = true;
                }
            }
        });
    });
});


   