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

local display = false

RegisterCommand("nui", function(source, args)
    SetDisplay(not display)
end, "admin")

RegisterNetEvent('vendita:nui', function(source, args)
	SetDisplay(not display)
end)


RegisterNUICallback("exit", function(data)
    --chat("exited", {0,255,0})
    SetDisplay(false)
end)

RegisterNUICallback("invia", function(data)
    --chat("exited", {0,255,0})
    SetDisplay(false)
end)

RegisterNUICallback("main", function(data)
	
	if data.text == 'aluminum' then
		price = alumprice
		name = "Alluminio"
	elseif data.text == 'copper' then
		price = copprice
		name = "Rame"
	elseif data.text == 'glass' then
		price = glassprice
		name = "Vetro"
	elseif data.text == 'iron' then
		price = ironprice
		name = "Ferro"
	elseif data.text == 'plastic' then
		price = plasticprice
		name = "Plastica"
	elseif data.text == 'rubber' then
		price = rubberprice
		name = "Gomma"
	elseif data.text == 'steel' then
		price = steelprice
		name = "Acciaio"
	elseif data.text == 'aluminumoxide' then
		price = aluminumoxideprice
		name = "Ossido di Alluminio"
	elseif data.text == 'ironoxide' then
		price = ironoxideprice
		name = "Ossido di Rame"
	else
		price = 100
	end
	
	local dialog = exports['qb-input']:ShowInput({
			header = "Vendita Materiali",
			submitText = "Vendi!",
			inputs = {
				{
					type = 'number',
					isRequired = true,
					name = 'quant',
					text = "Prezzo per unità: " ..price
				},
			}
		})
	if dialog then
		if not dialog.quant then return end
		TriggerServerEvent("Vendita:server:vendi", dialog.quant, data.text)
	end
    --chat(data.text, {0,255,0})
    SetDisplay(false)
end)

RegisterNUICallback("error", function(data)
    --chat(data.error, {255,0,0})
    SetDisplay(false)
end)

function SetDisplay(bool)
    display = bool
    SetNuiFocus(bool, bool)
    SendNUIMessage({
        type = "ui",
        status = bool,
    })
end

Citizen.CreateThread(function()
    while display do
        Citizen.Wait(0)
        DisableControlAction(0, 1, display) -- Guarda sin/des
        DisableControlAction(0, 2, display) -- Guarda su/giù
        DisableControlAction(0, 142, display) -- attacco corpo a corpo
        DisableControlAction(0, 18, display) -- Enter
        DisableControlAction(0, 322, display) -- ESC
        DisableControlAction(0, 106, display) -- BOH era utile
    end
end)

function chat(str, color)
    TriggerEvent(
        'chat:addMessage',
        {
            color = color,
            multiline = true,
            args = {str}
        }
    )
end

Citizen.CreateThread(function()
	local ven = AddBlipForCoord(vector3(1221.71, -2997.27, 5.87))
	SetBlipSprite(ven, 404)
	SetBlipDisplay(ven, 6)
	SetBlipScale(ven, 0.85)
	SetBlipAsShortRange(ven, true)
	SetBlipColour(ven, 68)
	BeginTextCommandSetBlipName("STRING")
    AddTextComponentSubstringPlayerName("Vendita Materiali")
    EndTextCommandSetBlipName(ven)
end)
