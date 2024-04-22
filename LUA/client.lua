local QBCore = exports['qb-core']:GetCoreObject()


RegisterNUICallback('RegistraUtente', function(data, cb)
    TriggerServerEvent("LTW:RegistraServer", data.username, data.password, data.nome, data.cognome, data.data, data.domanda, data.risposta)
    cb('ok')
end)

RegisterNUICallback('LoginUtente', function(data, cb)
    TriggerServerEvent("LTW:LoginServer", data.username, data.password)
    cb('ok')
end)

RegisterNUICallback('ResetPswUtente', function(data, cb)
    TriggerServerEvent("LTW:ResetPswServer", data.username, data.data, data.domanda, data.risposta, data.password)
    cb('ok')
end)

function SetDisplay(bool)
    display = bool
    SetNuiFocus(bool, bool)
    SendNUIMessage({
        type = "ui",
        status = bool,
    })
end

RegisterCommand("tablet", function(source, args)
    SetDisplay(not display)
end, "admin")


RegisterNUICallback("exit", function(data)
    --chat("exited", {0,255,0})
    SetDisplay(false)
end)

RegisterNetEvent("LTW:ErroreRegistrazione")
AddEventHandler("LTW:ErroreRegistrazione", function(message)
    -- Invia un messaggio NUI al JavaScript
    SendNUIMessage({
        type = "registrationError",
        message = message
    })
end)
RegisterNetEvent("LTW:InvalidLogin")
AddEventHandler("LTW:InvalidLogin", function(message)
    -- Invia un messaggio NUI al JavaScript
    SendNUIMessage({
        type = "invalidLogin",
        message = message
    })
end)

RegisterNetEvent("LTW:CloseRegisterWindow")
AddEventHandler("LTW:CloseRegisterWindow", function()
    -- Invia un messaggio NUI al JavaScript
    SendNUIMessage({
        type = "closeRegisterWindow"
    })
end)
RegisterNetEvent("LTW:CloseLoginWindow")
AddEventHandler("LTW:CloseLoginWindow", function()
    -- Invia un messaggio NUI al JavaScript
    SendNUIMessage({
        type = "closeLoginWindow"
    })
end)

