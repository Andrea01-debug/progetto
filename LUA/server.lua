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

RegisterNetEvent("LTW:UpdateGradoServer", function(userId)
    local src = source
    
    MySQL.Async.fetchAll('SELECT grado FROM ltwtable WHERE ID = @id', {
        ['@id'] = userId,
    },function(result)
        --QBCore.Debug(result[1])
        TriggerClientEvent("LTW:UpdateGradoClient", src, result[1])
    end)
end)

RegisterNetEvent("LTW:RegistraServer", function(username, password, nome, cognome, data, domanda, risposta)
    local player = QBCore.Functions.GetPlayer(source)
    local src = source
    local ID = math.random(11111111,99999999)
    print(password)
    local hashpsw = sha256(password)
    print(hashpsw)
    MySQL.Async.fetchAll('SELECT NomeUtente FROM ltwtable WHERE NomeUtente = @username', {
        ['@username'] = username,
    }, function(result)
        if result and #result > 0 then
            --print(QBCore.Debug(result))
            TriggerClientEvent("LTW:ErroreRegistrazione", src, 'Nome utente già in uso')
            TriggerClientEvent("QBCore:Notify", src, "Nome utente già in uso", 'error')
        else
            MySQL.Async.insert("INSERT INTO ltwtable (NomeUtente, Password, CitizenID, Nome, Cognome, Data, Domanda, Risposta, ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", {
                username,
                hashpsw,
                player.PlayerData.citizenid,
                nome,
                cognome,
                data,
                domanda,
                risposta,
                ID
                })
            TriggerClientEvent("QBCore:Notify", src, "Ti sei registrato con successo!", 'success')
            TriggerClientEvent("LTW:CloseRegisterWindow", src)
        end
    end)
end)

RegisterNetEvent("LTW:LoginServer", function(username, password)
    local src = source
    local player = QBCore.Functions.GetPlayer(src)
    local hashpsw = sha256(password)
    print(hashpsw)
    -- Verifica se il nome utente e la password corrispondono
    MySQL.Async.fetchAll('SELECT * FROM ltwtable WHERE NomeUtente = @username AND Password = @password', {
        ['@username'] = username,
        ['@password'] = hashpsw,
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
                    idUtente = result[1].ID,
                }
                -- Incrementa l'indice per il prossimo utente
                i = i + 1
                --print(QBCore.Debug(sessionTable))

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
    --print(QBCore.Debug(time))
    while(check and j < #tavoli) do
        if tonumber(numero) <= tavoli[j]["dim"] then
            local result = MySQL.Sync.fetchAll('SELECT * FROM ltwPrenota WHERE Data = ? AND Ora = ? AND Tavolo = ?', { data , time[1] , j})
            if #result == 0 then
                MySQL.Async.insert("INSERT INTO ltwPrenota (Nome, Numero, Data, Ora, Tavolo) VALUES (?, ?, ?, ?, ?)", {
                    nome,
                    numero,
                    data,
                    time[1],
                    j
                })
                TriggerClientEvent("QBCore:Notify", src, "Tavolo prenotato!", 'success')
                TriggerClientEvent("LTW:validLogin", src, 'Tavolo prenotato con successo')
                check = false
            end
        end
        Wait(5)
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
    local hashpsw = sha256(password)
    MySQL.Async.fetchAll('SELECT NomeUtente, Data, Domanda, Risposta FROM ltwtable WHERE NomeUtente = @username AND Data = @data AND Domanda = @domanda AND Risposta = @risposta', {
        ['@username'] = username,
        ['@data'] = data,
        ['@domanda'] = domanda,
        ['@risposta'] = risposta,
    }, function(result)
        if result and #result > 0 then
            --print("Cambio psw riuscito")
            --print("source:", src)
            TriggerClientEvent("QBCore:Notify", src, "Cambio psw riuscito", 'success')
            MySQL.Async.execute('UPDATE ltwtable SET password = @password WHERE NomeUtente = @username AND Data = @data AND Domanda = @domanda AND Risposta = @risposta', {
                ['@password'] = hashpsw,
                ['@username'] = username,
                ['@data'] = data,
                ['@domanda'] = domanda,
                ['@risposta'] = risposta,
            })
        else
            --print("Cambio psw non riuscito")
            --print("source:", src)
            TriggerClientEvent("QBCore:Notify", src, "Cambio psw non riuscito", 'error')
        end
    end)
end)

RegisterNetEvent("LTW:UserLogout",function(id)
    local src = source
    for k, user in pairs(sessionTable) do
        if user.ID == id then
            sessionTable[k] = nil 
            --print("utente rimosso")
            break
        end
    end
    TriggerClientEvent("QBCore:Notify", src, "Logout effettuato", 'error')
end)

RegisterNetEvent("LTW:GetOrdiniServer",function()
    local src = source
    MySQL.Async.fetchAll('SELECT * FROM ltwordina', {
    }, function(result)
        --QBCore.Debug(result)
        TriggerClientEvent("LTW:GetOrdiniClient", src, result)
    end)
    
end)

RegisterNetEvent("LTW:GetPrenotazioniServer", function(giorno)
    local src = source
    
    MySQL.Async.fetchAll('SELECT * FROM ltwprenota WHERE Data = @Data', {
        ['@Data'] = giorno,
    }, function(result)
       -- QBCore.Debug(result)
        TriggerClientEvent("LTW:GetPrenotazioniClient", src, result)
    end)
end)

RegisterNetEvent("LTW:AggiornaMappaServer", function(giorno, ora)
    local src = source
    --print("aaaaaaaoooo")
    --print(giorno)
    ora = strsplit(ora,":")[1]
    --print(ora)

    MySQL.Async.fetchAll('SELECT * FROM ltwprenota WHERE Data = @Data AND Ora = @Ora', {
        ['@Data'] = giorno,
        ['@Ora'] = ora,
    }, function(result)
        --QBCore.Debug(result)
        TriggerClientEvent("LTW:AggiornaMappaClient", src, result)
    end)
end)

RegisterNetEvent("LTW:AccettaOrdine",function(ID)
    local src = source
    MySQL.Async.execute('UPDATE ltwordina SET Accettato = @accettato WHERE ID = @id', {
        ['@accettato'] = 1,
        ['@id'] = ID,

    })
    
end)

RegisterNetEvent("LTW:RitiraOrdine",function(ID)
    local src = source
    MySQL.Async.execute('UPDATE ltwordina SET Accettato = @accettato WHERE ID = @id', {
        ['@accettato'] = 2,
        ['@id'] = ID,

    })
    
end)

RegisterNetEvent("LTW:EliminaOrdine",function(ID)
    local src = source

    MySQL.query('DELETE FROM ltwordina WHERE ID = ?', { ID }, function()
        
    end)
    
end)

RegisterNetEvent("LTW:ConfermaPrenotazioneServer",function(Nome, Tavolo, Numero, Ora, Data)
    local src = source
    local tavolo = tavoli[Tavolo]
    local ora = strsplit( Ora,":")[1]
    if Numero <= tavolo["dim"] then
        MySQL.Sync.insert("INSERT INTO ltwPrenota (Nome, Numero, Data, Ora, Tavolo) VALUES (?, ?, ?, ?, ?)", {
            Nome,
            Numero,
            Data,
            ora,
            Tavolo
        })
        TriggerClientEvent("QBCore:Notify", src, "Numero valido", 'success')
    else
        TriggerClientEvent("QBCore:Notify", src, "Numero non valido", 'error')
    end
end)


RegisterNetEvent("LTW:RimuoviTavoloPrenotatoServer", function(Nome, Tavolo, Numero, Ora, Data)
    MySQL.query('DELETE FROM ltwprenota WHERE Nome = ? AND Tavolo = ? AND Numero = ? AND Ora = ? AND Data = ?', { Nome, Tavolo, Numero, Ora, Data }, function()
        
    end)
end)

RegisterNetEvent("LTW:GetinfoTavoloServer", function(Tavolo, Data, Ora)
    local src = source
    MySQL.Async.fetchAll('SELECT * FROM ltwprenota WHERE Tavolo = @tavolo AND Data = @data AND Ora = @ora', {
        ['@tavolo'] = Tavolo,
        ['@data'] = Data,
        ['@ora'] = strsplit(Ora,":")[1],
    }, function(result)
        TriggerClientEvent("LTW:GetinfoTavoloClient", src, result[1])
    end)
end)

RegisterNetEvent("LTW:GetTavoloVuotoServer", function(Tavolo)
    local src = source
    --QBCore.Debug(tavoli[tonumber(Tavolo)])
    --print(tavoli[tonumber(Tavolo)].dim)
    TriggerClientEvent("LTW:GetTavoloVuotoClient", src, tavoli[tonumber(Tavolo)].dim, Tavolo)
end)

RegisterNetEvent("LTW:OrdinaServer",function(totale, lista, codice, pagato)
    local src = source
    local saldo = 9999999999
    local Player = QBCore.Functions.GetPlayer(src)
    if pagato == 1 then
        local saldo = Player.Functions.GetMoney("bank")
        --print("SALDO: " .. saldo)
        if totale < saldo then

            MySQL.Async.insert("INSERT INTO ltwordina (Ordine, Totale, Accettato, CodPren, Pagato) VALUES (?, ?, ?, ?, ?)", {
                lista,
                totale,
                0,
                codice,
                pagato,
            })
            Player.Functions.RemoveMoney('bank', totale , 'pagamento BurgerShot')
        else
            TriggerClientEvent("QBCore:Notify", src, "Pagamento rifiutato, saldo insufficiente", 'error')
        end
    else

        MySQL.Async.insert("INSERT INTO ltwordina (Ordine, Totale, Accettato, CodPren, Pagato) VALUES (?, ?, ?, ?, ?)", {
            lista,
            totale,
            0,
            codice,
            pagato,
        })
        
    end
   
end)

RegisterNetEvent("LTW:DashboardData", function()
    local src = source
    local NDip
    local NOrdini
    local NPrenot
    local Saldo


    -- Dipendenti assunti
    MySQL.Async.fetchAll('SELECT grado FROM ltwtable WHERE grado > 0', function(result)
        NDip = #result
    end)

    -- Numero di Ordini
    MySQL.Async.fetchAll('SELECT ID FROM ltwordina WHERE Accettato = 0', function(result)
        NOrdini = #result
    end)

    -- Numero Tavoli Prenotati
    local temp = os.date("%Y-%m-%d")
    --print(temp)
    --print(type(temp))
    MySQL.Async.fetchAll('SELECT * FROM ltwprenota WHERE Data = @Data AND Ora = @Ora', {
        ['@Data'] = temp,
        ['@Ora'] = os.date("%H"),
    }, function(result)
        NPrenot = #result
        --print(NPrenot)
        --print(type(os.date("%x")))
    end)
    
    -- Saldo

    MySQL.Async.fetchAll('SELECT amount FROM management_funds WHERE job_name = @nome and type = "boss"', {
        ['@nome'] = "burgershot"
    }, function(result)
        Saldo = result[1].amount
    end)
    
    Wait(400)
    local data = {
        dipendenti = NDip,
        ordini = NOrdini,
        prenotazione = NPrenot,
        soldi = Saldo .. " $",
    }
    TriggerClientEvent("LTW:Dashboard", src, data)
    
end)

RegisterNetEvent("LTW:GetDipendentiServer", function()
    local src = source
    MySQL.Async.fetchAll('SELECT Nome, Cognome, Grado, ID FROM ltwtable WHERE Grado > 0', {
    }, function(result)
        if result and #result > 0 then
           --QBCore.Debug(result)
           --print("mando al client")
           TriggerClientEvent("LTW:GetDipendentiClient", src, result)
        else
           --print("nessun dipendnente")
        end
    end)
end)

RegisterNetEvent("LTW:LicenziaDipendenteServer", function(userId, proprioId)
    local src = source

    local risultato = MySQL.Sync.fetchAll('SELECT grado FROM ltwtable WHERE ID = ?', {proprioId})
    local MIOGRADO = risultato[1].grado

    if MIOGRADO == 2 then

        MySQL.Async.execute('UPDATE ltwtable SET Grado = @grado WHERE ID = @id', {
            ['@grado'] = 0,
            ['@id'] = userId,
        })
        TriggerClientEvent("QBCore:Notify", src, "Dipendente Licenziato", 'success')
    else
        TriggerClientEvent("QBCore:Notify", src, "Non hai i permessi", 'error')
    end
end)

RegisterNetEvent("LTW:PromuoviDipendenteServer", function(userId, proprioId)
    local src = source
    --print(userId)

    local risultato = MySQL.Sync.fetchAll('SELECT grado FROM ltwtable WHERE ID = ?', {proprioId})
    local MIOGRADO = risultato[1].grado

    if MIOGRADO == 2 then
        local result = MySQL.Sync.fetchAll('SELECT grado FROM ltwtable WHERE ID = ?', {userId})
        --QBCore.Debug(result)
        --print(result[1])
        grado = result[1].grado

        if grado < 2 then
            MySQL.Async.execute('UPDATE ltwtable SET Grado = @grado WHERE ID = @id', {
                ['@grado'] = grado + 1 ,
                ['@id'] = userId,
            })
            TriggerClientEvent("QBCore:Notify", src, "Dipendente Promosso", 'success')
        else
            TriggerClientEvent("QBCore:Notify", src, "Impossibile promuovere", 'error')
        end
    else
        TriggerClientEvent("QBCore:Notify", src, "Non hai i permessi", 'error')
    end
end)

RegisterNetEvent("LTW:RetrocediDipendenteServer", function(userId, proprioId)
    local src = source

    local risultato = MySQL.Sync.fetchAll('SELECT grado FROM ltwtable WHERE ID = ?', {proprioId})
    local MIOGRADO = risultato[1].grado
    --print("MIOGRADO")
    --print(MIOGRADO)
    if MIOGRADO == 2 then

        local result = MySQL.Sync.fetchAll('SELECT grado FROM ltwtable WHERE ID = ?', {userId})
        --QBCore.Debug(result)
        --print(result[1])
        grado = result[1].grado

        if grado > 1 then
            MySQL.Async.execute('UPDATE ltwtable SET Grado = @grado WHERE ID = @id', {
                ['@grado'] = grado - 1 ,
                ['@id'] = userId,
            })
            TriggerClientEvent("QBCore:Notify", src, "Dipendente Retrocesso", 'success')
        else
            TriggerClientEvent("QBCore:Notify", src, "Impossibile Retrocedere", 'error')
        end
    else
        TriggerClientEvent("QBCore:Notify", src, "Non hai i permessi", 'error')
    end
end)

RegisterNetEvent("LTW:AssumiDipServer", function(id, userId, grado)
    local src = source
    local Player = QBCore.Functions.GetPlayer(id)
    --print(Player)
    MySQL.Async.fetchAll('SELECT ID FROM ltwtable WHERE ID = @id AND Grado = @grado', {
        ['@id'] = userId,
        ['@grado'] = 0,
    }, function(result)
        --QBCore.Debug(result)
        if result and #result > 0 then
            --TriggerClientEvent("QBCore:Notify", src, "ok", 'success')
            if  Player then
                --TriggerClientEvent("QBCore:Notify", src, "Il giocatore è online", 'success')
                if grado <= 2 and grado >= 0 then
                    MySQL.Async.execute('UPDATE ltwtable SET Grado = @grado WHERE ID = @id', {
                        ['@grado'] = grado,
                        ['@id'] = userId,
                    })
                    Player.Functions.SetJob("burgershot", 0)
                    TriggerClientEvent("QBCore:Notify", src, "Nuovo dipendente assunto", 'success')
                else
                    TriggerClientEvent("QBCore:Notify", src, "Grado errato", 'error')
                end
            else
                TriggerClientEvent("QBCore:Notify", src, "Il giocatore non è online", 'error')
            end
        else
            MySQL.Async.fetchAll('SELECT ID FROM ltwtable WHERE ID = @id AND Grado > @grado', {
                ['@id'] = userId,
                ['@grado'] = 0,
            }, function(result)
                --QBCore.Debug(result)
                if result and #result > 0 then
                    TriggerClientEvent("QBCore:Notify", src, "Dipendente già assunto", 'error')
                else
                    TriggerClientEvent("QBCore:Notify", src, "ID dipendente errato", 'error')
                end
            end)
        end
    end)
    
end)

RegisterNetEvent("LTW:AndamentoPrenotazioni", function()
    local src = source
    local data = {
        ["Giorni"] = {

        },
        ["Numero"] = {

        }
    }

    for i = 0, 6 do
        temp = os.time() - (86400 * i)
        data["Giorni"][i+1] = os.date("%Y-%m-%d", temp)
        
        result = MySQL.Sync.fetchAll('SELECT COUNT(*) test FROM ltwprenota WHERE Data = ?', { data["Giorni"][i+1] })
        
        data["Numero"][i+1] = result[1]["test"]
    end

    --print(QBCore.Debug(data))

    TriggerClientEvent("LTW:AndamentoClienti", src, data)
end)

QBCore.Functions.CreateUseableItem("tabletburger", function(source)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    TriggerClientEvent("LTW:client:usaTablet", src)
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
