local QBCore = exports['qb-core']:GetCoreObject()
id = 0

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

RegisterNUICallback('PrenotaTavolo', function(data, cb)
    print("1")
    TriggerServerEvent("LTW:PrenotaUnTavolo", data.nome, data.numero, data.giorno, data.ora)
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
    SendNUIMessage({
        type = "invalidLogin",
        message = message
    })
end)

RegisterNetEvent("LTW:CloseRegisterWindow")
AddEventHandler("LTW:CloseRegisterWindow", function()
    SendNUIMessage({
        type = "closeRegisterWindow"
    })
end)

RegisterNetEvent("LTW:CloseLoginWindow")
AddEventHandler("LTW:CloseLoginWindow", function()
    SendNUIMessage({
        type = "closeLoginWindow"
    })
end)

--[[ RegisterNetEvent("LTW:loginEffettuato")
AddEventHandler("LTW:loginEffettuato", function(data)
    print(data.Nome)
    id = data.ID
    print(id)
    if data.Grado == 0 then
        SendNUIMessage({
            type = "loginUser"
        })
    elseif data.Grado == 1 then
        SendNUIMessage({
            type = "loginWorker"
        })
    elseif data.Grado == 3 then
        SendNUIMessage({
            type = "loginAdmin"
        })
    end
end) ]]


RegisterNetEvent("LTW:loginEffettuato")
AddEventHandler("LTW:loginEffettuato", function(data)
    id = data.ID
    print("ID CLIENT ACCEDI: ", id)
    
    SendNUIMessage({
        type = "setUserGrade",
        userId = id,
        grade = data.Grado
    })
    SendNUIMessage({
        type = "loginUser"
    })
end)


RegisterNUICallback("LogoutUser", function(data, cb)
    print("Utente disconnesso dal client")
    
    print("ID CLIENT LOGOUT: ", id)
    TriggerServerEvent("LTW:UserLogout", id, cb)
    id = 0
    cb('ok')
end)


Wait(2000)
SetDisplay(false)