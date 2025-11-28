import { useState, useEffect } from "react"
import { View, Image, TouchableOpacity, Text, FlatList, Alert } from "react-native"

import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Filter } from "@/components/Filter"
import { Item } from "@/components/Item"

import { styles } from "./styles"
import { FilterStatus } from "@/types/FilterStatus"
import { itemsStorage, ItemStorage } from "@/storage/itemsStorage"

const FILTER_STATUS: FilterStatus[] = [FilterStatus.PENDING, FilterStatus.DONE]

export function Home() {
	const [filter, setFilter] = useState(FilterStatus.PENDING)
	const [description, setDescription] = useState("")
	const [items, setItems] = useState<ItemStorage[]>([])

	function handleAdd() {
		if (!description.trim()) {
			return Alert.alert("Adicionar", "Informe a descrição para adicionar.")
		}
		const newItem = {
			id: Math.random().toString(36).substring(2),
			description,
			status: FilterStatus.PENDING,
		}
		setItems((prevState) => [...prevState, newItem])
	}
	async function getItems(){
		try {
			const response = await itemsStorage.get()
			setItems(response)
		} catch (error) {
			console.log(error)
			Alert.alert("Erro", "Não foi possível filtrar os itens.")
		}
	}

	useEffect(() => {
		getItems()
	}, [])

	return (
		<View style={styles.container}>
	  		<Image source={require("@/assets/logo.png")} style={styles.logo} />

	  		<View style={styles.form}>
				<Input
		  			placeholder="O que você precisa comprar?"
		  			onChangeText={setDescription}
				/>
				<Button title="Adicionar" onPress={handleAdd} />
	  		</View>

	  		<View style={styles.content}>
				<View style={styles.header}>
					{FILTER_STATUS.map((status) => (
						<Filter
							key={status}
							status={status}
							isActive={status === filter}
							onPress={() => setFilter(status)}
						/>
					))}
					<TouchableOpacity style={styles.clearButton}>
						<Text style={styles.clearText}>Limpar</Text>
					</TouchableOpacity>
				</View>

				<FlatList
					data={items}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<Item
							data={item}
							onStatus={() => console.log("muda o status")}
							onRemove={() => console.log("remove o item")}
						/>
					)}
		  			showsVerticalScrollIndicator={true}
		  			ItemSeparatorComponent={() => <View style={styles.separator} />}
		  			contentContainerStyle={styles.listContent}
		  			ListEmptyComponent={() => (
						<Text style={styles.empty}>Nenhum item aqui.</Text>
		  			)}
				/>
	  		</View>
		</View>
  )
}
