--[[ AddEventHandler('onResourceStart', function(resourceName)
    if resourceName == 'LTW' then
        -- Invia un evento a tutti i client per resettare il local storage
        TriggerClientEvent('LTW:ResetLocalStorage', -1)
    end
end) ]]

local QBCore = exports['qb-core']:GetCoreObject()
local sessionTable = {}
local i = 1
local tavoli = {
    [1] = {
        ["numero"] = 1,
        ["dim"] = 2
    },
    [2] = {
        ["numero"] = 2,
        ["dim"] = 2
    },
    [3] = {
        ["numero"] = 3,
        ["dim"] = 2
    },
    [4] = {
        ["numero"] = 4,
        ["dim"] = 2
    },
    [5] = {
        ["numero"] = 5,
        ["dim"] = 3
    },
    [6] = {
        ["numero"] = 6,
        ["dim"] = 3
    },
    [7] = {
        ["numero"] = 7,
        ["dim"] = 4
    },
    [8] = {
        ["numero"] = 8,
        ["dim"] = 4
    },
    [9] = {
        ["numero"] = 9,
        ["dim"] = 4
    },
    [10] = {
        ["numero"] = 10,
        ["dim"] = 4
    },
    [11] = {
        ["numero"] = 11,
        ["dim"] = 4
    },
    [12] = {
        ["numero"] = 12,
        ["dim"] = 4
    },
    [13] = {
        ["numero"] = 13,
        ["dim"] = 5
    },
    [14] = {
        ["numero"] = 14,
        ["dim"] = 5
    },
    
}


RegisterNetEvent("LTW:RegistraServer", function(username, password, nome, cognome, data, domanda, risposta)
    local player = QBCore.Functions.GetPlayer(source)
    local src = source
    MySQL.Async.fetchAll('SELECT NomeUtente FROM ltwtable WHERE NomeUtente = @username', {
        ['@username'] = username,
    }, function(result)
        if result and #result > 0 then
            print(QBCore.Debug(result))
            TriggerClientEvent("LTW:ErroreRegistrazione", src, 'Nome utente già in uso')
            TriggerClientEvent("QBCore:Notify", src, "Nome utente già in uso", 'error')
        else
            MySQL.Async.insert("INSERT INTO ltwtable (NomeUtente, Password, CitizenID, Nome, Cognome, Data, Domanda, Risposta) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", {
                username,
                password,
                player.PlayerData.citizenid,
                nome,
                cognome,
                data,
                domanda,
                risposta
                })
            TriggerClientEvent("QBCore:Notify", src, "Ti sei registrato con successo!", 'success')
            TriggerClientEvent("LTW:CloseRegisterWindow", src)
        end
    end)
end)

RegisterNetEvent("LTW:LoginServer", function(username, password)
    local src = source
    local player = QBCore.Functions.GetPlayer(src)

    -- Verifica se il nome utente e la password corrispondono
    MySQL.Async.fetchAll('SELECT * FROM ltwtable WHERE NomeUtente = @username AND Password = @password', {
        ['@username'] = username,
        ['@password'] = password,
    }, function(result)
        if result and #result > 0 then
            -- Controlla se l'utente è già nella sessione
            if not usernameExists(username) then
                sessionTable[i] = {
                    ID = i,  -- ID univoco
                    Source = src,
                    NomeUtente = username,
                    CitizenID = player.PlayerData.citizenid,
                    Nome = result[1].Nome,
                    Cognome = result[1].Cognome,
                    Grado = result[1].Grado,
                }
                -- Incrementa l'indice per il prossimo utente
                i = i + 1
                print(QBCore.Debug(sessionTable))

                TriggerClientEvent("LTW:CloseLoginWindow", src)
                TriggerClientEvent("QBCore:Notify", src, "Login riuscito", 'success')
                TriggerClientEvent("LTW:loginEffettuato", src, sessionTable[i - 1])
            else
                -- Utente già loggato
                TriggerClientEvent("LTW:InvalidLogin", src, 'Sessione già attiva')
            end
        else
            -- Login fallito
            TriggerClientEvent("LTW:InvalidLogin", src, 'Nome utente o password errati')
            TriggerClientEvent("QBCore:Notify", src, "Nome utente o password errati", 'error')
        end
    end)
end)

RegisterNetEvent("LTW:PrenotaUnTavolo", function(nome, numero, data, ora)
    local src = source
    local check = true
    local j = 1
    local time = strsplit(ora, ":")
    print(QBCore.Debug(time))
    while(check and j < #tavoli) do
        --[[ print("- j")
        print(j)
        print("- check")
        print(check)
        print('- data')
        print(data)
        print('- ora')
        print(time[1]) ]]
        print(j)
        if tonumber(numero) <= tavoli[j]["dim"] then
            MySQL.Async.fetchAll('SELECT * FROM ltwPrenota WHERE Data = @data AND Ora = @ora AND Tavolo = @tavolo', {
                ['@tavolo'] = j,
                ['@data'] = data,
                ['@ora'] = ora,
            }, function(result)
                print(j)
                print(#result)
                print(#result)
                print(QBCore.Debug(result))
                print(j)
                if #result == 0 then
                    MySQL.Async.insert("INSERT INTO ltwPrenota (Nome, Numero, Data, Ora, Tavolo) VALUES (?, ?, ?, ?, ?)", {
                        nome,
                        numero,
                        data,
                        ora,
                        j
                    })
                    TriggerClientEvent("QBCore:Notify", src, "Tavolo prenotato!", 'success')
                    check = false
                end
            end)
        end
        print("Wait")
        Wait(1500)
        j = j + 1;
    end
    if check == true then
        TriggerClientEvent("QBCore:Notify", src, "Non è stato possibile prenotare un tavolo, cambia giorno o ora", 'error')
    end


end)

function usernameExists(username)
    -- Controlla se un utente con questo nome utente è attualmente loggato
    for _, user in pairs(sessionTable) do
        if user.NomeUtente == username then
            return true
        end
    end
    return false
end

RegisterNetEvent("LTW:ResetPswServer", function(username, data, domanda, risposta, password)    
    local src = source
    MySQL.Async.fetchAll('SELECT NomeUtente, Data, Domanda, Risposta FROM ltwtable WHERE NomeUtente = @username AND Data = @data AND Domanda = @domanda AND Risposta = @risposta', {
        ['@username'] = username,
        ['@data'] = data,
        ['@domanda'] = domanda,
        ['@risposta'] = risposta,
    }, function(result)
        if result and #result > 0 then
            print("Cambio psw riuscito")
            print("source:", src)
            TriggerClientEvent("QBCore:Notify", src, "Cambio psw riuscito", 'success')
            MySQL.Async.execute('UPDATE ltwtable SET password = @password WHERE NomeUtente = @username AND Data = @data AND Domanda = @domanda AND Risposta = @risposta', {
                ['@password'] = password,
                ['@username'] = username,
                ['@data'] = data,
                ['@domanda'] = domanda,
                ['@risposta'] = risposta,
            })
        else
            print("Cambio psw non riuscito")
            print("source:", src)
            TriggerClientEvent("QBCore:Notify", src, "Cambio psw non riuscito", 'error')
        end
    end)
end)

RegisterNetEvent("LTW:UserLogout",function(id)
    local src = source
    for k, user in pairs(sessionTable) do
        if user.ID == id then
            sessionTable[k] = nil 
            print("utente rimosso")
            break
        end
    end
    TriggerClientEvent("QBCore:Notify", src, "Logout effettuato", 'error')
end)


-- strsplit

function strsplit (inputstr, sep)
    if sep == nil then
       sep = "%s"
    end
    local t={}
    for str in string.gmatch(inputstr, "([^"..sep.."]+)") do
       table.insert(t, str)
    end
    return t
 end