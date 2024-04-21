local QBCore = exports['qb-core']:GetCoreObject()
local alumprice = 10
local copprice = 4
local glassprice = 7
local ironprice = 5
local plasticprice = 8
local rubberprice = 20
local steelprice = 6
local aluminumoxideprice = 860
local ironoxideprice = 550

RegisterServerEvent('Vendita:server:vendi', function(amount, item)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
	local price = 0
	local name
	if item == 'aluminum' then
		price = alumprice
		name = "Alluminio"
	elseif item == 'copper' then
		price = copprice
		name = "Rame"
	elseif item == 'glass' then
		price = glassprice
		name = "Vetro"
	elseif item == 'iron' then
		price = ironprice
		name = "Ferro"
	elseif item == 'plastic' then
		price = plasticprice
		name = "Plastica"
	elseif item == 'rubber' then
		price = rubberprice
		name = "Gomma"
	elseif item == 'steel' then
		price = steelprice
		name = "Acciaio"
	elseif item == 'aluminumoxide' then
		price = aluminumoxideprice
		name = "Ossido di Alluminio"
	elseif item == 'ironoxide' then
		price = ironoxideprice
		name = "Ossido di Rame"
	else
		price = 100
	end

	if Player.Functions.RemoveItem(item, amount) then
		Player.Functions.AddMoney("cash", price*amount)
		TriggerClientEvent("inventory:client:ItemBox", source, QBCore.Shared.Items[item], "remove")
		TriggerClientEvent('QBCore:Notify', src, 'Hai venduto '..amount.." "..name.." per $"..price*amount, "error")
	else
		TriggerClientEvent('QBCore:Notify', src, 'Non hai abbastanza materiale', "error")
	end
end)