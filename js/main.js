/*********************************************************************************
* WEB422 – Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Nikita Sushko Student ID: 105075196 Date: 10/09/2020
*
********************************************************************************/


    let saleData = [];
    let page = 1;
    let perPage = 10;
    const saleTableTemplate = _.template(
        `<% _.forEach(saleData, function(sales) { %>
            <tr data-id=<%- sales._id %>>
                <td><%- sales.customer.email %></td>
                <td><%- sales.storeLocation %></td>
                <td><%- sales.items.length %></td>
                <td><%- moment.utc(sales.saleDate).local().format('LLLL') %></td>
                
            </tr>
        <% }); %>`
    );
    const saleModelBodyTemplate = _.template(
        `<h4>Customer</h4>
        <strong>email:</strong> <%- sale.customer.email %><br>
        <strong>age:</strong> <%- sale.customer.age %><br>
        <strong>satisfaction:</strong> <%- sale.customer.satisfaction %> / 5
        <br><br>
        <h4> Items: $<%- sale.total.toFixed(2) %> </h4>
        <table class="table">
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
            <% _.forEach(sale.items, function(sales) { %>
                <tr data-id = <%- sales._id %>>
                    <td><%- sales.name %></td>
                    <td><%- sales.quantity %></td>
                    <td><%- sales.price %></td>
                </tr>
            <% }); %>
            </tbody>
        </table>`);

        function loadSaleData() {
            fetch(`https://sushko-web422-assignment-1.herokuapp.com/api/sales?page=${page}&perPage=${perPage}`)
                .then(response => response.json())
                .then(json => {
                    saleData = json;
                    let rowData = saleTableTemplate({ sales: saleData });
                    $("#sale-table tbody").html(rowData);
                    $("#current-page").html(page);
                });
        }

        $(function() {
            loadSaleData();
        });

        function getSaleById(id){

            let retVal = null;
            for(let i =0; i < saleData.length; i++){
                if(saleData[i]._id == id){
                    retVal = _.cloneDeep(saleData[i]);
                }
        
            }
            return retVal;
        }

        $("#sale-table tbody").on("click", "tr", function() {
    

   
            let clickedId = $(this).attr("data-id");
        
            
            let clickedSale = getSaleById(clickedId);
        
            clickedSale.total = 0;
        
        
            for (let index = 0; index < clickedSale.items.length; index++) {
                clickedSale.total += (clickedSale.items[index].price * clickedSale.items[index].quantity);
                clickedSale.total += 10;
            }
        
            
        
            $('#sale-modal').modal({ 
                backdrop: 'static', 
                keyboard: false
            });

            $(".modal-title").text(`Sale: ${clickedSale._id}`);
        
            $(".modal-body").empty();
            $(".modal-body").html(saleModelBodyTemplate({ 'sale' : clickedSale}));
        
        });

        $("#previous-page").on("click", function() {

            if (page > 1) {
                page--;
            }
        
         
            loadSaleData();
        });
        
        
        $("#next-page").on("click", function(e) {
        
        
            page++;
        
        
            loadSaleData();
        });